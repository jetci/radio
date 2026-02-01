
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Station } from './types';
import { radioApi } from './services/radioApi';
import { geminiService } from './services/geminiService';
import GlobeView from './components/GlobeView';
import Sidebar from './components/Sidebar';
import AudioPlayer from './components/AudioPlayer';
import CityInfoPanel from './components/CityInfoPanel';
import WelcomeOverlay from './components/WelcomeOverlay';
import NavigationBar from './components/NavigationBar';
import SettingsPanel, { UserSettings } from './components/SettingsPanel';
import ConfirmDialog from './components/ConfirmDialog';
import { GlobeSkeleton } from './components/LoadingSkeleton';
import OnlineCounter from './components/OnlineCounter';
import { Signal, MapPin, Play, Globe as GlobeIcon, Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from './contexts/ThemeContext';
import { useListeningHistory } from './hooks/useListeningHistory';
import { clusterStationsByCity } from './utils/cityCluster';
import { getCountryCoordinates } from './utils/countryCoordinates';

const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { history, addToHistory, clearHistory } = useListeningHistory();

  const [allStations, setAllStations] = useState<Station[]>([]); // Store all global stations (with coords)
  const [allStationsIncludingNoCoords, setAllStationsIncludingNoCoords] = useState<Station[]>([]); // All stations including no coords
  const [stations, setStations] = useState<Station[]>([]); // Currently displayed stations
  const [tunedStation, setTunedStation] = useState<Station | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showStartOverlay, setShowStartOverlay] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('Detecting Local Sector...');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);
  const [navPanelOpen, setNavPanelOpen] = useState(false); // Browse/Search/Favorites panel
  const [showHideConfirm, setShowHideConfirm] = useState(false);
  const [stationToHide, setStationToHide] = useState<Station | null>(null);
  const [selectedStationForGlobe, setSelectedStationForGlobe] = useState<Station | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings>({
    maxStationsToShow: 1000,
    hiddenStations: []
  });
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [userCountryCode, setUserCountryCode] = useState<string>('');
  const [userCountryLat, setUserCountryLat] = useState<number | null>(null);
  const [userCountryLng, setUserCountryLng] = useState<number | null>(null);
  const [isLocalMode, setIsLocalMode] = useState<boolean>(false); // Start with global view
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCityInfo, setShowCityInfo] = useState(true); // Show city info panel by default
  const [isAiJourneyLoading, setIsAiJourneyLoading] = useState(false);

  const [favorites, setFavorites] = useState<Station[]>(() => {
    const saved = localStorage.getItem('j-radio-favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const initializeApp = useCallback(async () => {
    setIsLoading(true);
    setLoadingStatus('Locking Local Frequency...');

    let detectedCC = '';

    // 1. STEP 1: Minimal Country Detection (Functional only, no visual tracking)
    try {
      const geoResponse = await fetch('https://ipapi.co/json/');
      if (geoResponse.status === 429) {
        console.warn("⚠️ IPAPI Rate limited (429). Using timezone fallback.");
        throw new Error("429");
      }
      if (geoResponse.ok) {
        const geoData = await geoResponse.json();
        detectedCC = geoData.country_code;
        setUserCountry(geoData.country_name);
        setUserCountryCode(detectedCC);
        setUserCountryLat(geoData.latitude);
        setUserCountryLng(geoData.longitude);
        setLoadingStatus(`Synchronizing with ${geoData.country_name}...`);
      } else {
        throw new Error("IP Geo failed");
      }
    } catch (err) {
      console.log("📍 Geo-Location fallback active...");
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz.includes('Bangkok') || tz.includes('Asia/Ho_Chi_Minh')) {
        detectedCC = 'TH';
        setUserCountry('Thailand');
        setUserCountryLat(13.7563);
        setUserCountryLng(100.5018);
      } else {
        const locale = navigator.language || 'en-US';
        detectedCC = locale.split('-')[1] || 'US';
        setUserCountry(detectedCC === 'TH' ? 'Thailand' : 'Global');
        setUserCountryLat(detectedCC === 'TH' ? 13.7563 : 20);
        setUserCountryLng(detectedCC === 'TH' ? 100.5018 : 0);
      }
      setUserCountryCode(detectedCC);
      setLoadingStatus(`System online. Area: ${detectedCC}`);
    }

    // 2. STEP 2: Content Fetching (All Stations - Equality for All)
    try {
      const finalCC = detectedCC || 'TH';

      // Fetch ALL stations (equality - no voting bias)
      setLoadingStatus('Loading Global Radio Network...');
      console.log('🌐 Fetching stations from Radio Browser API...');

      // Now fetching WITHOUT limit and WITHOUT has_geo=true to get everyone
      let rawStations = [];
      try {
        rawStations = await radioApi.getAllStations();
        console.log(`✅ Received ${rawStations.length} stations from API`);
      } catch (apiError) {
        console.error('❌ Failed to fetch stations from API:', apiError);
        setLoadingStatus('Failed to load stations. Please refresh.');
        throw apiError;
      }

      // Process stations: Map missing coords to country centers
      // Process stations: Strictly filter out stations with missing coordinates
      // as requested by user to ensure stability.
      setLoadingStatus('Processing station data...');
      console.log('🔄 Filtering stations with valid coordinates...');

      // เก็บสถานีทั้งหมด (รวมที่ไม่มีพิกัด) สำหรับ Settings
      setAllStationsIncludingNoCoords(rawStations);

      // กรองเฉพาะสถานีที่มีพิกัดจริง (ไม่ใช้พิกัดประเทศ)
      const processedStations = rawStations.filter(s => {
        // Strict check: Must have real coordinates
        return (
          s.geo_lat !== null &&
          s.geo_lat !== undefined &&
          s.geo_long !== null &&
          s.geo_long !== undefined &&
          !(s.geo_lat === 0 && s.geo_long === 0)
        );
      });

      console.log(`✅ Filtered to ${processedStations.length} stations with valid geolocation`);
      console.log(`📊 Total stations including no coords: ${rawStations.length}`);

      // Load user settings
      const savedSettings = localStorage.getItem('userSettings');
      if (savedSettings) {
        const settings: UserSettings = JSON.parse(savedSettings);
        setUserSettings(settings);
        console.log(`⚙️ Loaded user settings: ${settings.maxStationsToShow} max, ${settings.hiddenStations.length} hidden`);
      }

      setLoadingStatus('Preparing visualization...');
      setAllStations(processedStations);
      setStations(processedStations);
      setIsLocalMode(false);

      // Count local stations for display
      const allLocalStations = processedStations.filter(
        s => s.countrycode === finalCC
      );

      setLoadingStatus(`Found ${allLocalStations.length} stations in ${userCountry || 'your area'}...`);
      console.log(`✅ Initialization complete!`);

    } catch (err) {
      console.error("❌ Critical System Link Failure:", err);
      setLoadingStatus('Error loading stations. Please refresh.');
      // Still proceed to show UI even if there's an error
    } finally {
      setTimeout(() => {
        console.log('🎉 Loading complete, showing start overlay');
        setIsLoading(false);
        setShowStartOverlay(true);
      }, 800);
    }
  }, []);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  const handleStart = () => {
    setShowStartOverlay(false);

    // Show user's country stations first (Local Mode)
    if (userCountryCode && allStations.length > 0) {
      console.log(`🎯 Starting with local stations from ${userCountry} (${userCountryCode})`);

      // Filter stations in user's country with geo coordinates
      const localStations = allStations.filter(
        s => s.countrycode?.toUpperCase() === userCountryCode.toUpperCase() &&
          s.geo_lat && s.geo_long
      );

      console.log(`📍 Found ${localStations.length} local stations with coordinates`);

      if (localStations.length > 0) {
        // Start with local mode (show local stations first)
        setStations(localStations);
        setIsLocalMode(true);

        // Auto-play the most popular local station
        const topLocalStation = localStations.reduce((prev, current) =>
          (current.votes || 0) > (prev.votes || 0) ? current : prev
        );

        console.log(`🎵 Auto-playing top local station: ${topLocalStation.name}`);
        setTunedStation(topLocalStation);
        setIsPlaying(true);
        addToHistory(topLocalStation);

        // After 3 seconds, load all stations in background (for exploration)
        setTimeout(() => {
          console.log(`🌍 Loading all stations for exploration...`);
          setStations(allStations);
          setIsLocalMode(false);
          console.log(`✅ All ${allStations.length} stations now available`);
        }, 3000);
      } else {
        // No local stations, show all
        console.log(`⚠️ No local stations found, showing all stations`);
        setStations(allStations);
        setIsLocalMode(false);
        setIsPlaying(true);
      }
    } else {
      // No country detected, show all stations
      setStations(allStations);
      setIsLocalMode(false);
      setIsPlaying(true);
    }
  };

  // Apply user settings to filter stations
  useEffect(() => {
    if (allStations.length === 0) return;

    let filtered = [...allStations];

    // Filter out hidden stations
    if (userSettings.hiddenStations.length > 0) {
      filtered = filtered.filter(s => !userSettings.hiddenStations.includes(s.stationuuid));
    }

    // Limit number of stations
    filtered = filtered.slice(0, userSettings.maxStationsToShow);

    console.log(`⚙️ Applied settings: ${filtered.length} stations (from ${allStations.length})`);
    setStations(filtered);
  }, [userSettings, allStations]);


  const handleSelectStation = (station: Station, shouldCenter: boolean = true) => {
    setTunedStation(station);
    setIsPlaying(true);
    addToHistory(station);
    setShowCityInfo(true);

    // ตรวจสอบว่ามีพิกัดหรือไม่
    if (shouldCenter && station.geo_lat && station.geo_long && !(station.geo_lat === 0 && station.geo_long === 0)) {
      setSelectedStationForGlobe(station); // หมุน Globe ไปยังสถานี
    } else {
      // Clear selected station if we aren't centering, so we don't trigger the manual jump effect
      setSelectedStationForGlobe(null);
    }
  };

  const toggleFavorite = (station: Station) => {
    setFavorites(prev => {
      const isFav = prev.some(s => s.stationuuid === station.stationuuid);
      const next = isFav ? prev.filter(s => s.stationuuid !== station.stationuuid) : [...prev, station];
      localStorage.setItem('j-radio-favorites', JSON.stringify(next));
      return next;
    });
  };

  const toggleLocalGlobal = () => {
    if (isLocalMode) {
      // Switch to Global mode - show all stations
      setStations(allStations);
      setIsLocalMode(false);
    } else {
      // Switch to Local mode - filter by user's country AND has geo coordinates
      const localStations = allStations.filter(
        s => s.countrycode === userCountryCode && s.geo_lat && s.geo_long
      );
      setStations(localStations);
      setIsLocalMode(true);

      // Switch to first local station if available
      if (localStations.length > 0) {
        setTunedStation(localStations[0]);
      }
    }
  };

  // AI Journey - Suggest station based on mood
  const handleAiJourney = async () => {
    setIsAiJourneyLoading(true);
    try {
      const userMood = prompt('🤖 AI Journey: Describe your mood or what you want to listen to...');
      if (!userMood) {
        setIsAiJourneyLoading(false);
        return;
      }

      const suggestion = await geminiService.getAiJourney(userMood);

      // Search for stations matching the AI suggestion
      const matchingStations = allStations.filter(s =>
        (s.country?.toLowerCase().includes(suggestion.country.toLowerCase()) ||
          s.countrycode?.toLowerCase() === suggestion.country.toLowerCase()) &&
        s.tags?.toLowerCase().includes(suggestion.tag.toLowerCase())
      );

      if (matchingStations.length > 0) {
        // Pick a random station from matches
        const randomStation = matchingStations[Math.floor(Math.random() * matchingStations.length)];
        setTunedStation(randomStation);
        setIsPlaying(true);
        addToHistory(randomStation);

        // Show alert with AI reasoning
        setTimeout(() => {
          alert(`🎵 AI Journey: ${suggestion.reason}\n\nNow playing: ${randomStation.name}\nFrom: ${randomStation.country}`);
        }, 500);
      } else {
        alert(`No stations found matching "${suggestion.tag}" in ${suggestion.country}. Try a different mood!`);
      }
    } catch (error) {
      console.error('AI Journey failed:', error);
      alert('AI Journey encountered an error. Please try again.');
    } finally {
      setIsAiJourneyLoading(false);
    }
  };

  // Theme-aware background colors
  const bgColor = theme === 'dark' ? 'bg-[#020617]' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';

  return (
    <div className={`w-screen h-screen ${bgColor} ${textColor} relative overflow-hidden font-sans transition-colors duration-500`}>
      {/* Show loading skeleton while loading stations */}
      {isLoading && <GlobeSkeleton />}

      {/* Show globe when loaded */}
      {!isLoading && (
        <GlobeView
          stations={stations}
          onSelectStation={handleSelectStation}
          activeStation={tunedStation}
          selectedStation={selectedStationForGlobe}
          userCountryCoords={userCountryLat && userCountryLng ? { lat: userCountryLat, lng: userCountryLng } : null}
          showStartOverlay={showStartOverlay}
          theme={theme}
        />
      )}

      <Sidebar
        stations={stations}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        onSelectStation={handleSelectStation}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        history={history}
        onClearHistory={clearHistory}
        onAutoTune={() => {
          const target = stations[Math.floor(Math.random() * stations.length)];
          handleSelectStation(target);
        }}
        onFilterChange={async (params) => {
          setIsLoading(true);
          try {
            const results = await radioApi.searchStations(params);
            setStations(results);
          } finally {
            setIsLoading(false);
          }
        }}
        onSearch={(query) => {
          setSearchQuery(query);
          if (query.trim()) {
            const filtered = allStations.filter(s =>
              s.name.toLowerCase().includes(query.toLowerCase()) ||
              s.country?.toLowerCase().includes(query.toLowerCase()) ||
              s.countrycode?.toLowerCase().includes(query.toLowerCase())
            );
            setStations(filtered);
          } else {
            setStations(allStations);
          }
        }}
        isFiltered={searchQuery.length > 0}
        onResetFilter={() => {
          setSearchQuery('');
          setStations(allStations);
        }}
        theme={theme}
      />

      <AudioPlayer
        station={tunedStation}
        isPlaying={isPlaying}
        volume={0.8}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onVolumeChange={() => { }}
        onExploreClick={() => setSidebarOpen(true)}
        isFavorite={favorites.some(s => s.stationuuid === tunedStation?.stationuuid)}
        onToggleFavorite={() => tunedStation && toggleFavorite(tunedStation)}
        onHideStation={() => {
          if (tunedStation) {
            setStationToHide(tunedStation);
            setShowHideConfirm(true);
          }
        }}
        theme={theme}
        isSettingsOpen={settingsPanelOpen || navPanelOpen}
      />

      {/* CITY INFO PANEL */}
      {showCityInfo && tunedStation && (
        <CityInfoPanel
          station={tunedStation}
          allStations={allStations}
          theme={theme}
          onClose={() => setShowCityInfo(false)}
        />
      )}

      {/* NAVIGATION BAR (Radio Garden Style) */}
      <NavigationBar
        stations={stations}
        allStations={allStationsIncludingNoCoords}
        favorites={favorites}
        onSelectStation={handleSelectStation}
        onFocusStation={(station) => setSelectedStationForGlobe(station)}
        onOpenSidebar={() => setSidebarOpen(true)}
        onOpenSettings={() => setSettingsPanelOpen(true)}
        theme={theme}
        isSettingsOpen={settingsPanelOpen}
        onPanelChange={setNavPanelOpen}
      />

      {/* SETTINGS PANEL */}
      <SettingsPanel
        isOpen={settingsPanelOpen}
        onClose={() => setSettingsPanelOpen(false)}
        stations={allStationsIncludingNoCoords}
        onUpdateSettings={setUserSettings}
        onSelectStation={handleSelectStation}
        onFocusStation={(station) => setSelectedStationForGlobe(station)}
        onPauseMainPlayer={() => setIsPlaying(false)}
        onResumeMainPlayer={() => setIsPlaying(true)}
        theme={theme}
      />

      {/* AI JOURNEY BUTTON - Hidden for cleaner layout */}
      {/* <div className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-auto">
        <button onClick={handleAiJourney}>AI Journey</button>
      </div> */}

      {/* ONLINE COUNTER, THEME TOGGLE & LOCAL/GLOBAL BUTTONS (Top Right - Vertical on Mobile) */}
      <div className="fixed top-4 right-4 md:top-6 md:right-6 z-50 flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-2">
        {/* Online Counter */}
        {!settingsPanelOpen && <OnlineCounter />}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`group backdrop-blur-xl border rounded-full p-1.5 md:p-2 transition-all ${theme === 'dark'
            ? 'bg-black/80 border-white/10 hover:border-yellow-500/50'
            : 'bg-white/80 border-gray-200 hover:border-purple-500/50'
            }`}
        >
          {theme === 'dark' ? (
            <Sun size={14} className="text-yellow-500 md:w-4 md:h-4" />
          ) : (
            <Moon size={14} className="text-purple-600 md:w-4 md:h-4" />
          )}
        </button>

        {/* Local/Global Toggle */}
        <button
          onClick={toggleLocalGlobal}
          className={`group backdrop-blur-xl border rounded-full px-2 py-1 md:px-3 md:py-1.5 flex items-center gap-1 md:gap-1.5 transition-all ${theme === 'dark'
            ? 'bg-black/80 border-white/10 hover:border-[#00ff41]/50'
            : 'bg-white/80 border-gray-200 hover:border-blue-500/50'
            }`}
        >
          <div className="flex items-center gap-1 md:gap-2">
            {isLocalMode ? (
              <>
                <MapPin size={12} className={`${theme === 'dark' ? 'text-[#00ff41]' : 'text-blue-600'} md:w-4 md:h-4`} />
                <span className={`text-[9px] md:text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {/* Truncate long country names on mobile */}
                  <span className="md:hidden">{(userCountry || 'Local').substring(0, 3)}</span>
                  <span className="hidden md:inline">{userCountry || 'Local'}</span>
                </span>
              </>
            ) : (
              <>
                <GlobeIcon size={12} className={`${theme === 'dark' ? 'text-white' : 'text-gray-700'} md:w-4 md:h-4`} />
                <span className={`text-[9px] md:text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Global
                </span>
              </>
            )}
          </div>
          <div className={`w-px h-2.5 md:h-4 ${theme === 'dark' ? 'bg-white/20' : 'bg-gray-300'}`}></div>
          <span className={`text-[8px] md:text-[10px] uppercase tracking-widest font-mono ${theme === 'dark' ? 'text-white/40' : 'text-gray-500'}`}>
            {stations.length} <span className="hidden md:inline">stations</span>
          </span>
        </button>
      </div>


      {/* WELCOME OVERLAY WITH TUTORIAL */}
      {showStartOverlay && !isLoading && (
        <WelcomeOverlay
          onClose={handleStart}
          onAutoTune={handleAiJourney}
          onOpenSidebar={() => {
            setSidebarOpen(true);
            handleStart();
          }}
          theme={theme}
        />
      )}

      {/* CONFIRM HIDE STATION DIALOG */}
      <ConfirmDialog
        isOpen={showHideConfirm}
        title="ซ่อนสถานีนี้?"
        message={`คุณต้องการซ่อนสถานี "${stationToHide?.name}" หรือไม่? คุณสามารถเปิดใหม่ได้ในการตั้งค่า`}
        confirmText="ซ่อนสถานี"
        cancelText="ยกเลิก"
        onConfirm={() => {
          if (stationToHide) {
            const newHidden = [...userSettings.hiddenStations, stationToHide.stationuuid];
            const newSettings = { ...userSettings, hiddenStations: newHidden };
            setUserSettings(newSettings);
            localStorage.setItem('userSettings', JSON.stringify(newSettings));
            setIsPlaying(false);
            setTunedStation(null);
          }
          setShowHideConfirm(false);
          setStationToHide(null);
        }}
        onCancel={() => {
          setShowHideConfirm(false);
          setStationToHide(null);
        }}
        theme={theme}
      />

      {/* LOADING SCREEN */}
      {isLoading && (
        <div className="fixed inset-0 z-[120] bg-[#020617] flex flex-col items-center justify-center">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-dashed border-[#00ff41]/20 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-4 border-t-2 border-[#00ff41] rounded-full animate-spin"></div>
            <GlobeIcon className="text-[#00ff41] animate-pulse" size={40} />
          </div>
          <div className="mt-16 flex flex-col items-center gap-3">
            <div className="text-[11px] font-mono text-[#00ff41] tracking-[0.6em] uppercase animate-pulse">{loadingStatus}</div>
            <div className="h-1 w-32 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-[#00ff41] w-1/2 animate-shimmer"></div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default App;

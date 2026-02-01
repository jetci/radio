import React, { useState } from 'react';
import { Globe2, Heart, List, Search, Settings } from 'lucide-react';
import { Station } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface NavigationBarProps {
  stations: Station[]; // สถานีที่มีพิกัด (สำหรับ Globe)
  allStations?: Station[]; // สถานีทั้งหมด (รวมไม่มีพิกัด)
  favorites: Station[];
  onSelectStation: (station: Station) => void;
  onFocusStation?: (station: Station) => void; // หมุน Globe ไปยังสถานี
  onOpenSidebar: () => void;
  onOpenSettings: () => void;
  theme: 'dark' | 'light';
  isSettingsOpen?: boolean;
  onPanelChange?: (isOpen: boolean) => void; // แจ้งเมื่อ Panel เปิด/ปิด
}

type NavTab = 'explore' | 'favorites' | 'browse' | 'search' | 'settings';

const NavigationBar: React.FC<NavigationBarProps> = ({
  stations,
  allStations,
  favorites,
  onSelectStation,
  onFocusStation,
  onOpenSidebar,
  onOpenSettings,
  theme,
  isSettingsOpen = false,
  onPanelChange
}) => {
  const { t } = useLanguage();
  // ใช้ allStations ถ้ามี ไม่งั้นใช้ stations
  const stationsToShow = allStations || stations;
  const [activeTab, setActiveTab] = useState<NavTab>('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [showStationList, setShowStationList] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');

  const bgColor = theme === 'dark' ? 'bg-black/90 border-white/10' : 'bg-white/90 border-gray-200';
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-white/60' : 'text-gray-600';
  const accentColor = theme === 'dark' ? 'text-[#00ff41]' : 'text-blue-600';
  const accentBg = theme === 'dark' ? 'bg-[#00ff41]/10' : 'bg-blue-50';

  // คำนวณตำแหน่ง Nav และ Panel (Nav อยู่ล่างสุด)
  // Nav อยู่ล่างสุด
  const navBottom = 'bottom-6'; // ล่างสุด (24px)
  const panelBottom = 'bottom-[90px]'; // เหนือ Nav (60px) + gap (30px)

  const handleTabClick = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === 'browse' || tab === 'search' || tab === 'favorites') {
      const newState = !showStationList;
      setShowStationList(newState);
      onPanelChange?.(newState); // แจ้ง App.tsx
    } else if (tab === 'settings') {
      onOpenSettings();
      setShowStationList(false);
      onPanelChange?.(false);
    } else {
      setShowStationList(false);
      onPanelChange?.(false);
    }
  };

  // Get unique countries
  const countries = Array.from(new Set(stationsToShow.map(s => s.country).filter(Boolean))).sort();

  // ฟังก์ชันหมุน Globe ไปยังประเทศ
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);

    if (country !== 'all' && onFocusStation) {
      // หาสถานีแรกของประเทศนั้น
      const firstStation = stationsToShow.find(s => s.country === country && s.geo_lat && s.geo_long);
      if (firstStation) {
        onFocusStation(firstStation); // หมุน Globe ไปยังสถานีแรก
      }
    }
  };

  // Get unique genres from tags
  const allGenres = new Set<string>();
  stationsToShow.forEach(s => {
    if (s.tags) {
      s.tags.split(',').forEach(tag => {
        const trimmed = tag.trim().toLowerCase();
        if (trimmed) allGenres.add(trimmed);
      });
    }
  });
  const genres = Array.from(allGenres).sort();

  const filteredStations = stationsToShow
    .filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCountry = selectedCountry === 'all' || s.country === selectedCountry;
      const matchesGenre = selectedGenre === 'all' ||
        (s.tags && s.tags.toLowerCase().includes(selectedGenre.toLowerCase()));
      return matchesSearch && matchesCountry && matchesGenre;
    })
    .slice(0, 100); // เพิ่มจาก 30 เป็น 100

  return (
    <>
      {/* NavigationBar - Bottom Left (Above AudioPlayer) */}
      <div
        className={`fixed bottom-0 left-0 w-full md:bottom-6 md:left-6 md:w-[280px] z-50 backdrop-blur-xl shadow-lg ${bgColor} border-t md:border border-white/10 rounded-t-2xl md:rounded-2xl ${isSettingsOpen ? 'hidden' : 'block'}`}
      >
        <div className="flex items-center justify-around gap-1 p-2">
          {/* Explore - Opens Main Sidebar */}
          <button
            data-testid="nav-explore-btn"
            onClick={() => {
              handleTabClick('explore');
              onOpenSidebar(); // Open main sidebar
            }}
            className={`p-2 rounded-lg transition-colors ${activeTab === 'explore' ? accentColor + ' ' + accentBg : textSecondary
              }`}
            title={t('navigation.explore')}
          >
            <Globe2 size={18} />
          </button>

          {/* Favorites */}
          <button
            data-testid="nav-favorites-btn"
            onClick={() => handleTabClick('favorites')}
            className={`p-2 rounded-lg transition-colors ${activeTab === 'favorites' ? accentColor + ' ' + accentBg : textSecondary
              }`}
            title={t('navigation.favorites')}
          >
            <Heart size={18} />
          </button>

          {/* Browse */}
          <button
            data-testid="nav-browse-btn"
            onClick={() => handleTabClick('browse')}
            className={`p-2 rounded-lg transition-colors ${activeTab === 'browse' ? accentColor + ' ' + accentBg : textSecondary
              }`}
            title={t('navigation.browse')}
          >
            <List size={18} />
          </button>

          {/* Search */}
          <button
            data-testid="nav-search-btn"
            onClick={() => handleTabClick('search')}
            className={`p-2 rounded-lg transition-colors ${activeTab === 'search' ? accentColor + ' ' + accentBg : textSecondary
              }`}
            title={t('navigation.search')}
          >
            <Search size={18} />
          </button>

          {/* Settings */}
          <button
            data-testid="nav-settings-btn"
            onClick={() => handleTabClick('settings')}
            className={`p-2 rounded-lg transition-colors ${activeTab === 'settings' ? accentColor + ' ' + accentBg : textSecondary
              }`}
            title={t('navigation.settings')}
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Station List Panel - Compact */}
      {(activeTab === 'browse' || activeTab === 'search') && showStationList && (
        <div className={`fixed inset-x-4 bottom-[80px] top-24 md:bottom-[90px] md:left-6 md:w-[400px] md:max-h-[400px] md:top-auto z-40 backdrop-blur-xl ${bgColor} overflow-y-auto rounded-2xl border shadow-lg`}>
          <div className="p-4">
            {/* Search Input */}
            {activeTab === 'search' && (
              <div className="mb-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('search.placeholder')}
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${theme === 'dark'
                    ? 'bg-white/5 border-white/10 text-white placeholder-white/40'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-[#00ff41]/50`}
                />
              </div>
            )}

            {/* Country Filter */}
            <div className="mb-3">
              <select
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border text-sm ${theme === 'dark'
                  ? 'bg-white/5 border-white/10 text-white'
                  : 'bg-white border-gray-200 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-[#00ff41]/50`}
                style={theme === 'light' ? { color: '#111827' } : undefined}
                title={t('search.country')}
              >
                <option value="all" style={{ color: '#111827', backgroundColor: '#ffffff' }}>{t('search.allCountries')} ({stationsToShow.length})</option>
                {countries.map(country => {
                  const count = stationsToShow.filter(s => s.country === country).length;
                  return (
                    <option key={country} value={country} style={{ color: '#111827', backgroundColor: '#ffffff' }}>
                      {country} ({count})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Genre Filter */}
            <div className="mb-3">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                style={theme === 'light' ? { color: '#111827' } : undefined}
                className={`w-full px-3 py-2 rounded-lg border text-sm ${theme === 'dark'
                  ? 'bg-white/5 border-white/10 text-white'
                  : 'bg-gray-50 border-gray-200 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-[#00ff41]/50`}
                title={t('search.genre')}
              >
                <option value="all" style={{ color: '#111827', backgroundColor: '#ffffff' }}>{t('search.allGenres')}</option>
                {genres.slice(0, 50).map(genre => (
                  <option key={genre} value={genre} style={{ color: '#111827', backgroundColor: '#ffffff' }}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            {/* Station List */}
            <div className="space-y-2">
              {filteredStations.map((station) => (
                <button
                  key={station.stationuuid}
                  onClick={() => {
                    onSelectStation(station);
                    onFocusStation?.(station); // หมุน Globe ไปยังสถานี
                    setShowStationList(false);
                    onPanelChange?.(false); // ปิด Panel และแสดง AudioPlayer
                  }}
                  className={`w-full text-left p-4 rounded-xl transition-all ${theme === 'dark'
                    ? 'bg-white/5 hover:bg-white/10 border border-white/10'
                    : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-bold truncate ${textPrimary}`}>
                        {station.name}
                      </h4>
                      <p className={`text-sm truncate ${textSecondary}`}>
                        {station.country}
                      </p>
                    </div>
                    <div className={`text-xs ${textSecondary} whitespace-nowrap`}>
                      {station.votes || 0} ⭐
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {filteredStations.length === 0 && (
              <div className={`text-center py-12 ${textSecondary}`}>
                <p>No stations found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Favorites List - Compact */}
      {activeTab === 'favorites' && showStationList && (
        <div className={`fixed inset-x-4 bottom-[80px] top-24 md:bottom-[90px] md:left-6 md:w-[400px] md:max-h-[400px] md:top-auto z-40 backdrop-blur-xl ${bgColor} overflow-y-auto rounded-2xl border shadow-lg`}>
          <div className="p-4">
            {favorites.length > 0 ? (
              <div className="space-y-2">
                {favorites.map((station) => (
                  <button
                    key={station.stationuuid}
                    onClick={() => {
                      onSelectStation(station);
                      onFocusStation?.(station); // หมุน Globe ไปยังสถานี
                      setShowStationList(false);
                      onPanelChange?.(false); // ปิด Panel และแสดง AudioPlayer
                    }}
                    className={`w-full text-left p-4 rounded-xl transition-all ${theme === 'dark'
                      ? 'bg-white/5 hover:bg-white/10 border border-white/10'
                      : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-bold truncate ${textPrimary}`}>
                          {station.name}
                        </h4>
                        <p className={`text-sm truncate ${textSecondary}`}>
                          {station.country}
                        </p>
                      </div>
                      <Heart size={16} className={accentColor} fill="currentColor" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className={`text-center py-12 ${textSecondary}`}>
                <Heart size={48} className="mx-auto mb-4 opacity-20" />
                <p>No favorites yet</p>
                <p className="text-xs mt-2">Click the heart icon on stations to save them</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NavigationBar;

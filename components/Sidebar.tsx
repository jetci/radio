
import React, { useState, useMemo } from 'react';
import { Search, Zap, Sparkles, X, Menu, Loader2, Radio, Signal, Radar, Heart, Clock, Trash2, Globe2, Filter, ChevronDown, ChevronRight, MapPin, Music, Languages, Wifi, List } from 'lucide-react';
import { Station } from '../types';
import { geminiService } from '../services/geminiService';

interface HistoryEntry {
  station: Station;
  timestamp: number;
  playCount: number;
}

interface SidebarProps {
  onSelectStation: (station: Station) => void;
  favorites: Station[];
  onToggleFavorite: (station: Station) => void;
  stations: Station[];
  onFilterChange: (params: { tag?: string; countrycode?: string; name?: string; lat?: number; long?: number }) => void;
  onSearch: (query: string) => void;
  isFiltered: boolean;
  onResetFilter: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onAutoTune?: () => void;
  history: HistoryEntry[];
  onClearHistory: () => void;
  theme: 'dark' | 'light';
}

type TabType = 'browse' | 'stations' | 'favorites' | 'history';
type FilterType = 'genre' | 'language' | 'bitrate' | 'country' | null;

const Sidebar: React.FC<SidebarProps> = ({
  onFilterChange,
  favorites,
  onSelectStation,
  stations,
  isOpen,
  setIsOpen,
  onAutoTune,
  onSearch,
  history,
  onClearHistory,
  theme
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('browse');
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);
  const [expandedCountries, setExpandedCountries] = useState<Set<string>>(new Set());
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedBitrate, setSelectedBitrate] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    onSearch(searchQuery);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleAiSearch = async () => {
    if (!searchQuery) return;
    setIsAiLoading(true);
    setAiSuggestions([]);
    try {
      const tags = await geminiService.getAiRecommendations(searchQuery);
      setAiSuggestions(tags);
    } finally {
      setIsAiLoading(false);
    }
  };

  const applyTag = (tag: string) => {
    onFilterChange({ tag });
  };

  const toggleCountry = (country: string) => {
    const newExpanded = new Set(expandedCountries);
    if (newExpanded.has(country)) {
      newExpanded.delete(country);
    } else {
      newExpanded.add(country);
    }
    setExpandedCountries(newExpanded);
  };

  // Extract unique genres, languages, and group by country
  const filterData = useMemo(() => {
    const genres = new Set<string>();
    const languages = new Set<string>();
    const countries = new Map<string, { name: string; code: string; count: number; stations: Station[] }>();

    stations.forEach(station => {
      // Extract genres from tags
      if (station.tags) {
        station.tags.split(',').forEach(tag => {
          const cleaned = tag.trim().toLowerCase();
          if (cleaned && cleaned.length > 2) {
            genres.add(cleaned);
          }
        });
      }

      // Extract languages
      if (station.language) {
        languages.add(station.language.trim());
      }

      // Group by country
      if (station.country && station.countrycode) {
        const existing = countries.get(station.countrycode);
        if (existing) {
          existing.count++;
          existing.stations.push(station);
        } else {
          countries.set(station.countrycode, {
            name: station.country,
            code: station.countrycode,
            count: 1,
            stations: [station]
          });
        }
      }
    });

    return {
      genres: Array.from(genres).sort().slice(0, 20), // Top 20 genres
      languages: Array.from(languages).sort().slice(0, 15), // Top 15 languages
      countries: Array.from(countries.values()).sort((a, b) => b.count - a.count).slice(0, 30) // Top 30 countries
    };
  }, [stations]);

  // Filter stations based on selected filters
  const filteredStations = useMemo(() => {
    let result = stations.filter(s => s.geo_lat && s.geo_long);

    if (selectedGenre) {
      result = result.filter(s => s.tags?.toLowerCase().includes(selectedGenre.toLowerCase()));
    }

    if (selectedLanguage) {
      result = result.filter(s => s.language === selectedLanguage);
    }

    if (selectedCountry) {
      result = result.filter(s => s.countrycode === selectedCountry);
    }

    if (selectedBitrate) {
      const bitrate = parseInt(selectedBitrate);
      result = result.filter(s => {
        const stationBitrate = s.bitrate || 0;
        if (selectedBitrate === '320+') return stationBitrate >= 320;
        if (selectedBitrate === '192-319') return stationBitrate >= 192 && stationBitrate < 320;
        if (selectedBitrate === '128-191') return stationBitrate >= 128 && stationBitrate < 192;
        if (selectedBitrate === '<128') return stationBitrate < 128;
        return true;
      });
    }

    return result.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0)).slice(0, 50);
  }, [stations, selectedGenre, selectedLanguage, selectedBitrate, selectedCountry]);

  const bgColor = theme === 'dark' ? 'bg-[#020617]/95' : 'bg-white/95';
  const borderColor = theme === 'dark' ? 'border-white/10' : 'border-gray-200';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const accentColor = theme === 'dark' ? 'text-[#00ff41]' : 'text-blue-600';
  const secondaryBg = theme === 'dark' ? 'bg-white/5' : 'bg-gray-100';
  const hoverBg = theme === 'dark' ? 'hover:bg-[#00ff41]/10' : 'hover:bg-blue-50';

  const renderBrowseTab = () => (
    <div className="space-y-6">
      {/* Filter Toggle Buttons */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => setActiveFilter(activeFilter === 'genre' ? null : 'genre')}
          className={`p-2 rounded-xl border transition-all flex flex-col items-center justify-center ${activeFilter === 'genre'
            ? theme === 'dark' ? 'bg-[#00ff41]/20 border-[#00ff41]/50' : 'bg-blue-100 border-blue-500'
            : theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'
            }`}
        >
          <Music size={14} className={activeFilter === 'genre' ? accentColor : 'opacity-50'} />
          <div className={`text-[8px] font-bold mt-1 uppercase ${activeFilter === 'genre' ? accentColor : 'opacity-50'}`}>Genre</div>
        </button>
        <button
          onClick={() => setActiveFilter(activeFilter === 'country' ? null : 'country')}
          className={`p-2 rounded-xl border transition-all flex flex-col items-center justify-center ${activeFilter === 'country'
            ? theme === 'dark' ? 'bg-[#00ff41]/20 border-[#00ff41]/50' : 'bg-blue-100 border-blue-500'
            : theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'
            }`}
        >
          <MapPin size={14} className={activeFilter === 'country' ? accentColor : 'opacity-50'} />
          <div className={`text-[8px] font-bold mt-1 uppercase ${activeFilter === 'country' ? accentColor : 'opacity-50'}`}>Region</div>
        </button>
        <button
          onClick={() => setActiveFilter(activeFilter === 'language' ? null : 'language')}
          className={`p-2 rounded-xl border transition-all flex flex-col items-center justify-center ${activeFilter === 'language'
            ? theme === 'dark' ? 'bg-[#00ff41]/20 border-[#00ff41]/50' : 'bg-blue-100 border-blue-500'
            : theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'
            }`}
        >
          <Languages size={14} className={activeFilter === 'language' ? accentColor : 'opacity-50'} />
          <div className={`text-[8px] font-bold mt-1 uppercase ${activeFilter === 'language' ? accentColor : 'opacity-50'}`}>Lang</div>
        </button>
        <button
          onClick={() => setActiveFilter(activeFilter === 'bitrate' ? null : 'bitrate')}
          className={`p-2 rounded-xl border transition-all flex flex-col items-center justify-center ${activeFilter === 'bitrate'
            ? theme === 'dark' ? 'bg-[#00ff41]/20 border-[#00ff41]/50' : 'bg-blue-100 border-blue-500'
            : theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'
            }`}
        >
          <Wifi size={14} className={activeFilter === 'bitrate' ? accentColor : 'opacity-50'} />
          <div className={`text-[8px] font-bold mt-1 uppercase ${activeFilter === 'bitrate' ? accentColor : 'opacity-50'}`}>Quality</div>
        </button>
      </div>

      {/* Active Filters Display */}
      {(selectedGenre || selectedLanguage || selectedBitrate || selectedCountry) && (
        <div className="flex flex-wrap gap-2">
          {selectedGenre && (
            <button
              onClick={() => setSelectedGenre(null)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-2 ${theme === 'dark' ? 'bg-[#00ff41]/20 text-[#00ff41]' : 'bg-blue-100 text-blue-600'
                }`}
            >
              <Music size={10} />
              {selectedGenre}
              <X size={10} />
            </button>
          )}
          {selectedCountry && (
            <button
              onClick={() => setSelectedCountry(null)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-2 ${theme === 'dark' ? 'bg-[#00ff41]/20 text-[#00ff41]' : 'bg-blue-100 text-blue-600'
                }`}
            >
              <MapPin size={10} />
              {filterData.countries.find(c => c.code === selectedCountry)?.name || selectedCountry}
              <X size={10} />
            </button>
          )}
          {selectedLanguage && (
            <button
              onClick={() => setSelectedLanguage(null)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-2 ${theme === 'dark' ? 'bg-[#00ff41]/20 text-[#00ff41]' : 'bg-blue-100 text-blue-600'
                }`}
            >
              <Languages size={10} />
              {selectedLanguage}
              <X size={10} />
            </button>
          )}
          {selectedBitrate && (
            <button
              onClick={() => setSelectedBitrate(null)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-2 ${theme === 'dark' ? 'bg-[#00ff41]/20 text-[#00ff41]' : 'bg-blue-100 text-blue-600'
                }`}
            >
              <Wifi size={10} />
              {selectedBitrate} kbps
              <X size={10} />
            </button>
          )}
        </div>
      )}

      {/* Filter Options */}
      {activeFilter === 'genre' && (
        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
          {filterData.genres.map(genre => (
            <button
              key={genre}
              onClick={() => {
                setSelectedGenre(genre);
                setActiveFilter(null);
              }}
              className={`w-full p-3 rounded-xl text-left transition-all ${selectedGenre === genre
                ? theme === 'dark' ? 'bg-[#00ff41]/20 border-[#00ff41]/50' : 'bg-blue-100 border-blue-500'
                : theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'
                } border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}
            >
              <div className={`text-[11px] font-bold uppercase ${selectedGenre === genre ? accentColor : textColor}`}>{genre}</div>
            </button>
          ))}
        </div>
      )}

      {activeFilter === 'country' && (
        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
          {filterData.countries.map(country => (
            <button
              key={country.code}
              onClick={() => {
                setSelectedCountry(country.code);
                setActiveFilter(null);
              }}
              className={`w-full p-3 rounded-xl text-left transition-all ${selectedCountry === country.code
                ? theme === 'dark' ? 'bg-[#00ff41]/20 border-[#00ff41]/50' : 'bg-blue-100 border-blue-500'
                : theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'
                } border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}
            >
              <div className="flex items-center justify-between">
                <div className={`text-[11px] font-bold uppercase ${selectedCountry === country.code ? accentColor : textColor}`}>{country.name}</div>
                <div className={`text-[9px] font-mono ${theme === 'dark' ? 'text-white/30' : 'text-gray-400'}`}>{country.count} stations</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {activeFilter === 'language' && (
        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
          {filterData.languages.map(language => (
            <button
              key={language}
              onClick={() => {
                setSelectedLanguage(language);
                setActiveFilter(null);
              }}
              className={`w-full p-3 rounded-xl text-left transition-all ${selectedLanguage === language
                ? theme === 'dark' ? 'bg-[#00ff41]/20 border-[#00ff41]/50' : 'bg-blue-100 border-blue-500'
                : theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'
                } border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}
            >
              <div className={`text-[11px] font-bold uppercase ${selectedLanguage === language ? accentColor : textColor}`}>{language}</div>
            </button>
          ))}
        </div>
      )}

      {activeFilter === 'bitrate' && (
        <div className="space-y-2">
          {['320+', '192-319', '128-191', '<128'].map(range => (
            <button
              key={range}
              onClick={() => {
                setSelectedBitrate(range);
                setActiveFilter(null);
              }}
              className={`w-full p-3 rounded-xl text-left transition-all ${selectedBitrate === range
                ? theme === 'dark' ? 'bg-[#00ff41]/20 border-[#00ff41]/50' : 'bg-blue-100 border-blue-500'
                : theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'
                } border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}
            >
              <div className={`text-[11px] font-bold uppercase ${selectedBitrate === range ? accentColor : textColor}`}>
                {range === '320+' ? 'High Quality (320+ kbps)' :
                  range === '192-319' ? 'Good Quality (192-319 kbps)' :
                    range === '128-191' ? 'Standard (128-191 kbps)' :
                      'Low Quality (<128 kbps)'}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Station Results */}
      {!activeFilter && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <p className={`text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${accentColor}`}>
              <Signal size={10} /> {selectedGenre || selectedLanguage || selectedBitrate ? 'Filtered' : 'Active'} Feeds
            </p>
            <span className={`text-[8px] font-mono ${theme === 'dark' ? 'text-white/20' : 'text-gray-400'}`}>{filteredStations.length} NODES</span>
          </div>

          <div className="space-y-2">
            {filteredStations.map((s) => (
              <button
                key={s.stationuuid}
                onClick={() => onSelectStation(s)}
                className={`w-full group border rounded-xl p-4 text-left transition-all flex items-center justify-between ${theme === 'dark'
                  ? 'bg-white/5 border-white/5 hover:bg-[#00ff41]/10 hover:border-[#00ff41]/30'
                  : 'bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                  }`}
              >
                <div className="min-w-0 pr-4">
                  <div className={`text-[11px] font-bold truncate uppercase mb-1 ${textColor}`}>{s.name}</div>
                  <div className={`flex items-center gap-2 text-[8px] font-mono ${theme === 'dark' ? 'text-white/40' : 'text-gray-500'}`}>
                    <span className={accentColor}>{s.countrycode}</span>
                    <span className="opacity-30">|</span>
                    <span>{s.bitrate || 0} KBPS</span>
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 ${theme === 'dark'
                  ? 'bg-white/5 text-white/20 group-hover:text-[#00ff41] group-hover:bg-[#00ff41]/10'
                  : 'bg-gray-200 text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-100'
                  }`}>
                  <Radio size={14} />
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  const renderFavoritesTab = () => (
    <section>
      <p className={`text-[9px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
        <Heart size={10} className="fill-current" /> Saved Locks
      </p>
      {favorites.length === 0 ? (
        <div className={`text-center py-12 ${theme === 'dark' ? 'text-white/30' : 'text-gray-400'}`}>
          <Heart size={32} className="mx-auto mb-3 opacity-20" />
          <p className="text-[11px] font-bold uppercase">No favorites yet</p>
          <p className="text-[9px] mt-1">Click the heart icon to save stations</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          {favorites.map(fav => (
            <button
              key={fav.stationuuid}
              onClick={() => onSelectStation(fav)}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all group ${theme === 'dark'
                ? 'bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10'
                : 'bg-blue-50 border border-blue-200 hover:bg-blue-100'
                }`}
            >
              <span className={`text-[10px] truncate uppercase font-bold ${theme === 'dark' ? 'text-white/60 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'}`}>{fav.name}</span>
              <div className={`w-6 h-6 rounded flex items-center justify-center ${theme === 'dark' ? 'bg-blue-500/10 text-blue-500' : 'bg-blue-200 text-blue-600'}`}>
                <Zap size={10} />
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );

  const renderStationsTab = () => {
    const [stationSearch, setStationSearch] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'votes' | 'country'>('votes');

    // Filter and sort stations
    const filteredStations = useMemo(() => {
      let filtered = stations;

      // Search filter
      if (stationSearch) {
        const query = stationSearch.toLowerCase();
        filtered = filtered.filter(s =>
          s.name.toLowerCase().includes(query) ||
          s.country?.toLowerCase().includes(query) ||
          s.tags?.toLowerCase().includes(query)
        );
      }

      // Sort
      return [...filtered].sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'votes') return (b.votes || 0) - (a.votes || 0);
        if (sortBy === 'country') return (a.country || '').localeCompare(b.country || '');
        return 0;
      });
    }, [stations, stationSearch, sortBy]);

    return (
      <section>
        <div className="mb-4">
          <p className={`text-[9px] font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-[#00ff41]' : 'text-blue-600'}`}>
            <List size={10} /> All Stations ({stations.length})
          </p>

          {/* Search */}
          <input
            type="text"
            value={stationSearch}
            onChange={(e) => setStationSearch(e.target.value)}
            placeholder="Filter stations..."
            className={`w-full border rounded-lg py-2 px-3 text-[10px] font-mono focus:outline-none transition-all mb-2 ${theme === 'dark'
              ? 'bg-white/5 border-white/10 focus:border-[#00ff41]/50 placeholder:text-white/20 text-white'
              : 'bg-gray-50 border-gray-200 focus:border-blue-500 placeholder:text-gray-400 text-gray-900'
              }`}
          />

          {/* Sort buttons */}
          <div className="flex gap-1">
            <button
              onClick={() => setSortBy('votes')}
              className={`flex-1 py-1.5 px-2 rounded text-[8px] font-bold uppercase transition-all ${sortBy === 'votes'
                ? theme === 'dark' ? 'bg-[#00ff41]/20 text-[#00ff41]' : 'bg-blue-100 text-blue-600'
                : theme === 'dark' ? 'bg-white/5 text-white/40' : 'bg-gray-100 text-gray-500'
                }`}
            >
              Popular
            </button>
            <button
              onClick={() => setSortBy('name')}
              className={`flex-1 py-1.5 px-2 rounded text-[8px] font-bold uppercase transition-all ${sortBy === 'name'
                ? theme === 'dark' ? 'bg-[#00ff41]/20 text-[#00ff41]' : 'bg-blue-100 text-blue-600'
                : theme === 'dark' ? 'bg-white/5 text-white/40' : 'bg-gray-100 text-gray-500'
                }`}
            >
              A-Z
            </button>
            <button
              onClick={() => setSortBy('country')}
              className={`flex-1 py-1.5 px-2 rounded text-[8px] font-bold uppercase transition-all ${sortBy === 'country'
                ? theme === 'dark' ? 'bg-[#00ff41]/20 text-[#00ff41]' : 'bg-blue-100 text-blue-600'
                : theme === 'dark' ? 'bg-white/5 text-white/40' : 'bg-gray-100 text-gray-500'
                }`}
            >
              Country
            </button>
          </div>
        </div>

        {filteredStations.length === 0 ? (
          <div className={`text-center py-12 ${theme === 'dark' ? 'text-white/30' : 'text-gray-400'}`}>
            <Radio size={32} className="mx-auto mb-3 opacity-20" />
            <p className="text-[11px] font-bold uppercase">No stations found</p>
            <p className="text-[9px] mt-1">Try a different search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-1.5">
            {filteredStations.slice(0, 100).map(station => (
              <button
                key={station.stationuuid}
                onClick={() => onSelectStation(station)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all group ${theme === 'dark'
                  ? 'bg-white/5 border border-white/5 hover:bg-[#00ff41]/10 hover:border-[#00ff41]/20'
                  : 'bg-gray-50 border border-gray-100 hover:bg-blue-50 hover:border-blue-200'
                  }`}
              >
                <div className="min-w-0 flex-1">
                  <span className={`text-[9px] truncate font-bold block ${theme === 'dark' ? 'text-white/70 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'}`}>
                    {station.name}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[7px] font-mono ${theme === 'dark' ? 'text-white/30' : 'text-gray-400'}`}>
                      {station.country || 'Unknown'}
                    </span>
                    {station.votes > 0 && (
                      <span className={`text-[7px] font-mono ${theme === 'dark' ? 'text-[#00ff41]/50' : 'text-blue-500'}`}>
                        ⭐ {station.votes}
                      </span>
                    )}
                  </div>
                </div>
                <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${theme === 'dark' ? 'bg-[#00ff41]/10 text-[#00ff41]' : 'bg-blue-100 text-blue-600'}`}>
                  <Radio size={8} />
                </div>
              </button>
            ))}
            {filteredStations.length > 100 && (
              <p className={`text-[8px] text-center py-2 ${theme === 'dark' ? 'text-white/30' : 'text-gray-400'}`}>
                Showing first 100 of {filteredStations.length} stations
              </p>
            )}
          </div>
        )}
      </section>
    );
  };

  const renderHistoryTab = () => (
    <section>
      <div className="flex items-center justify-between mb-4">
        <p className={`text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
          <Clock size={10} /> Recent Plays
        </p>
        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className={`p-1 rounded transition-colors ${theme === 'dark' ? 'text-white/30 hover:text-red-500' : 'text-gray-400 hover:text-red-600'}`}
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
      {history.length === 0 ? (
        <div className={`text-center py-12 ${theme === 'dark' ? 'text-white/30' : 'text-gray-400'}`}>
          <Clock size={32} className="mx-auto mb-3 opacity-20" />
          <p className="text-[11px] font-bold uppercase">No listening history</p>
          <p className="text-[9px] mt-1">Start exploring stations</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          {history.slice(0, 20).map(entry => (
            <button
              key={entry.station.stationuuid}
              onClick={() => onSelectStation(entry.station)}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all group ${theme === 'dark'
                ? 'bg-purple-500/5 border border-purple-500/10 hover:bg-purple-500/10'
                : 'bg-purple-50 border border-purple-200 hover:bg-purple-100'
                }`}
            >
              <div className="min-w-0">
                <span className={`text-[10px] truncate uppercase font-bold block ${theme === 'dark' ? 'text-white/60 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'}`}>{entry.station.name}</span>
                <span className={`text-[8px] font-mono ${theme === 'dark' ? 'text-white/30' : 'text-gray-400'}`}>{entry.playCount}x played</span>
              </div>
              <div className={`w-6 h-6 rounded flex items-center justify-center ${theme === 'dark' ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-200 text-purple-600'}`}>
                <Clock size={10} />
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );

  return (
    <>
      <div className={`fixed inset-y-0 right-0 z-[60] w-full max-w-md ${bgColor} backdrop-blur-2xl border-l ${borderColor} shadow-[-20px_0_50px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col p-5 md:p-8 overflow-hidden">

          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className={`text-xl font-black ${textColor} uppercase tracking-tighter flex items-center gap-2`}>
                <Radar size={18} className={accentColor} /> Signal Scanner
              </h2>
              <p className={`text-[9px] font-bold tracking-[0.3em] uppercase mt-1 ${theme === 'dark' ? 'text-white/30' : 'text-gray-400'}`}>Grid Management System</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className={`p-3 rounded-xl transition-colors ${theme === 'dark' ? 'bg-white/5 text-white/40 hover:text-white' : 'bg-gray-100 text-gray-600 hover:text-gray-900'}`}
              aria-label="Close sidebar"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>

          <button
            onClick={onAutoTune}
            className={`mb-6 w-full py-4 border rounded-xl transition-all flex items-center justify-center gap-3 group ${theme === 'dark'
              ? 'bg-[#00ff41]/10 border-[#00ff41]/30 hover:bg-[#00ff41] hover:text-black'
              : 'bg-blue-50 border-blue-300 hover:bg-blue-600 hover:text-white'
              }`}
          >
            <Zap size={16} className="group-hover:animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Auto-Tune Frequency</span>
          </button>

          <form onSubmit={handleSearch} className="relative mb-6">
            <input
              data-testid="sidebar-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="SEARCH STATION, COUNTRY, OR GENRE..."
              className={`w-full border rounded-xl py-4 px-6 text-xs font-mono focus:outline-none transition-all uppercase ${theme === 'dark'
                ? 'bg-white/5 border-white/10 focus:border-[#00ff41]/50 placeholder:text-white/10 text-white'
                : 'bg-gray-50 border-gray-200 focus:border-blue-500 placeholder:text-gray-400 text-gray-900'
                }`}
            />
            <div className="absolute right-3 top-2 flex gap-1">
              <button
                data-testid="sidebar-ai-search-btn"
                type="button"
                onClick={handleAiSearch}
                className={`p-2 rounded-lg transition-all ${isAiLoading
                  ? theme === 'dark' ? 'bg-[#00ff41]/20 text-[#00ff41]' : 'bg-blue-200 text-blue-600'
                  : theme === 'dark' ? 'bg-[#00ff41] text-black hover:scale-105' : 'bg-blue-600 text-white hover:scale-105'
                  }`}
              >
                {isAiLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              </button>
            </div>
          </form>

          {aiSuggestions.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2 animate-in fade-in slide-in-from-right-4 duration-500">
              {aiSuggestions.map((tag) => (
                <button
                  key={tag}
                  onClick={() => applyTag(tag)}
                  className={`px-3 py-1.5 border rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider ${theme === 'dark'
                    ? 'bg-[#00ff41]/10 border-[#00ff41]/20 text-[#00ff41] hover:bg-[#00ff41] hover:text-black'
                    : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white'
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {/* Tab Navigation */}
          <div className={`flex gap-2 mb-6 p-1 rounded-xl ${secondaryBg}`}>
            <button
              data-testid="tab-browse"
              onClick={() => setActiveTab('browse')}
              className={`flex-1 py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === 'browse'
                ? theme === 'dark' ? 'bg-[#00ff41] text-black' : 'bg-blue-600 text-white'
                : theme === 'dark' ? 'text-white/40 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                }`}
            >
              <Globe2 size={12} className="inline mr-1" />
              Browse
            </button>
            <button
              data-testid="tab-stations"
              onClick={() => setActiveTab('stations')}
              className={`flex-1 py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === 'stations'
                ? theme === 'dark' ? 'bg-[#00ff41] text-black' : 'bg-blue-600 text-white'
                : theme === 'dark' ? 'text-white/40 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                }`}
            >
              <List size={12} className="inline mr-1" />
              Stations
            </button>
            <button
              data-testid="tab-favorites"
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === 'favorites'
                ? theme === 'dark' ? 'bg-[#00ff41] text-black' : 'bg-blue-600 text-white'
                : theme === 'dark' ? 'text-white/40 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                }`}
            >
              <Heart size={12} className="inline mr-1" />
              Saved
            </button>
            <button
              data-testid="tab-history"
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === 'history'
                ? theme === 'dark' ? 'bg-[#00ff41] text-black' : 'bg-blue-600 text-white'
                : theme === 'dark' ? 'text-white/40 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                }`}
            >
              <Clock size={12} className="inline mr-1" />
              History
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2" data-testid="sidebar-content-area">
            {activeTab === 'browse' && renderBrowseTab()}
            {activeTab === 'stations' && renderStationsTab()}
            {activeTab === 'favorites' && renderFavoritesTab()}
            {activeTab === 'history' && renderHistoryTab()}
          </div>

          <div className={`mt-8 p-4 border rounded-2xl flex items-center justify-between ${secondaryBg} ${borderColor}`}>
            <div className="flex items-center gap-3">
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${theme === 'dark' ? 'bg-[#00ff41]' : 'bg-blue-600'}`}></div>
              <div className={`text-[8px] font-mono uppercase tracking-widest leading-tight ${theme === 'dark' ? 'text-white/40' : 'text-gray-500'}`}>
                Satellite Link Optimized
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: ${theme === 'dark' ? 'rgba(0,255,65,0.1)' : 'rgba(59,130,246,0.2)'}; 
          border-radius: 10px; 
        }
      `}</style>
    </>
  );
};

export default Sidebar;

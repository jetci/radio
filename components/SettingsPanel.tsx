import React, { useState, useEffect, useRef } from 'react';
import { X, Eye, EyeOff, Play, Pause, Volume2, Globe } from 'lucide-react';
import { Station } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  stations: Station[];
  onUpdateSettings: (settings: UserSettings) => void;
  onSelectStation?: (station: Station) => void; // เล่นสถานี
  onFocusStation?: (station: Station) => void; // หมุน Globe ไบยังสถานี
  onPauseMainPlayer?: () => void; // หยุดเล่นสถานีหลัก
  onResumeMainPlayer?: () => void; // เล่นสถานีหลักต่อ
  theme: 'dark' | 'light';
}

export interface UserSettings {
  maxStationsToShow: number;
  hiddenStations: string[];
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  stations,
  onUpdateSettings,
  onSelectStation,
  onFocusStation,
  onPauseMainPlayer,
  onResumeMainPlayer,
  theme
}) => {
  const { t, language, setLanguage } = useLanguage();
  const [maxStations, setMaxStations] = useState(1000);
  const [hiddenStations, setHiddenStations] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [previewStation, setPreviewStation] = useState<string | null>(null); // UUID of playing preview
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'with-coords' | 'without-coords' | 'hidden-stations'>('with-coords');
  const audioRef = useRef<HTMLAudioElement>(null);

  const bgColor = theme === 'dark' ? 'bg-black/95 border-white/10' : 'bg-white/95 border-gray-200';
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-white/60' : 'text-gray-600';
  const accentColor = theme === 'dark' ? 'text-[#00ff41]' : 'text-blue-600';
  const accentBg = theme === 'dark' ? 'bg-[#00ff41]/10' : 'bg-blue-50';

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('userSettings');
    if (saved) {
      const settings: UserSettings = JSON.parse(saved);
      setMaxStations(settings.maxStationsToShow);
      setHiddenStations(new Set(settings.hiddenStations));
    }
  }, []);

  const handleSave = () => {
    const settings: UserSettings = {
      maxStationsToShow: maxStations,
      hiddenStations: Array.from(hiddenStations)
    };
    localStorage.setItem('userSettings', JSON.stringify(settings));
    onUpdateSettings(settings);
    onClose();
  };

  const toggleStationVisibility = (stationUuid: string) => {
    const newHidden = new Set(hiddenStations);
    if (newHidden.has(stationUuid)) {
      newHidden.delete(stationUuid);
    } else {
      newHidden.add(stationUuid);
    }
    setHiddenStations(newHidden);
  };

  const handlePreview = (station: Station) => {
    if (!audioRef.current) return;

    // If clicking the same station, toggle play/pause
    if (previewStation === station.stationuuid && isPreviewPlaying) {
      audioRef.current.pause();
      setIsPreviewPlaying(false);
      onResumeMainPlayer?.(); // เล่นสถานีหลักต่อ
      return;
    }

    // หยุดสถานีหลักก่อนเล่นตัวอย่าง
    onPauseMainPlayer?.();

    // หยุด audio ก่อนเปลี่ยน source เพื่อป้องกัน AbortError
    audioRef.current.pause();
    audioRef.current.src = '';

    // Play new station
    audioRef.current.src = station.url_resolved || station.url;
    audioRef.current.load(); // โหลด source ใหม่
    audioRef.current.play()
      .then(() => {
        setPreviewStation(station.stationuuid);
        setIsPreviewPlaying(true);
      })
      .catch(err => {
        console.error('Preview failed:', err);
        setIsPreviewPlaying(false);
        onResumeMainPlayer?.(); // เล่นสถานีหลักต่อถ้า preview ล้มเหลว
      });
  };

  // Stop preview when closing panel
  useEffect(() => {
    if (!isOpen && audioRef.current) {
      audioRef.current.pause();
      setPreviewStation(null);
      setIsPreviewPlaying(false);
      onResumeMainPlayer?.(); // เล่นสถานีหลักต่อเมื่อปิด Settings
    }
  }, [isOpen]);

  // แยกสถานีที่มี/ไม่มีพิกัด
  const stationsWithCoords = stations.filter(s =>
    s.geo_lat !== null && s.geo_lat !== undefined &&
    s.geo_long !== null && s.geo_long !== undefined &&
    !(s.geo_lat === 0 && s.geo_long === 0) &&
    !hiddenStations.has(s.stationuuid) // ไม่แสดงสถานีที่ซ่อน
  );

  const stationsWithoutCoords = stations.filter(s =>
    (s.geo_lat === null || s.geo_lat === undefined ||
      s.geo_long === null || s.geo_long === undefined ||
      (s.geo_lat === 0 && s.geo_long === 0)) &&
    !hiddenStations.has(s.stationuuid) // ไม่แสดงสถานีที่ซ่อน
  );

  // สถานีที่ถูกซ่อน
  const hiddenStationsList = stations.filter(s =>
    hiddenStations.has(s.stationuuid)
  );

  // เลือกสถานีตาม activeTab
  const currentStations = activeTab === 'with-coords'
    ? stationsWithCoords
    : activeTab === 'without-coords'
      ? stationsWithoutCoords
      : hiddenStationsList;

  const filteredStations = currentStations
    .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 50);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      {/* Hidden Audio for Preview */}
      <audio
        ref={audioRef}
        onEnded={() => {
          setIsPreviewPlaying(false);
          setPreviewStation(null);
        }}
        onPause={() => setIsPreviewPlaying(false)}
        onPlay={() => setIsPreviewPlaying(true)}
      />

      <div className={`w-full max-w-2xl max-h-[80vh] m-4 rounded-2xl border shadow-2xl ${bgColor} overflow-hidden flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className={`text-2xl font-bold ${textPrimary}`}>{t('settings.title')}</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${theme === 'dark'
                ? 'hover:bg-white/10 text-white/60 hover:text-white'
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-800'
              }`}
            aria-label="Close settings"
            title="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Language Selector */}
          <div>
            <h3 className={`text-lg font-bold ${textPrimary} mb-3 flex items-center gap-2`}>
              <Globe size={20} />
              {t('settings.language')}
            </h3>
            <select
              data-testid="settings-language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'th' | 'en')}
              className={`w-full px-4 py-3 rounded-lg border text-base ${theme === 'dark'
                  ? 'bg-white/5 border-white/10 text-white'
                  : 'bg-white border-gray-200 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-[#00ff41]/50`}
              style={theme === 'light' ? { color: '#111827' } : undefined}
              aria-label="Select language"
              title="Select language"
            >
              <option value="th" style={{ color: '#111827', backgroundColor: '#ffffff' }}>🇹🇭 ไทย (Thai)</option>
              <option value="en" style={{ color: '#111827', backgroundColor: '#ffffff' }}>🇬🇧 English</option>
            </select>
          </div>

          {/* จำนวนสถานีที่แสดง */}
          <div>
            <h3 className={`text-lg font-bold ${textPrimary} mb-3`}>{t('settings.maxStations')}</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="100"
                  value={maxStations}
                  onChange={(e) => setMaxStations(Number(e.target.value))}
                  className="flex-1"
                />
                <span className={`text-lg font-bold ${accentColor} min-w-[80px]`}>
                  {maxStations} สถานี
                </span>
              </div>
              <p className={`text-sm ${textSecondary}`}>
                ยิ่งน้อยยิ่งโหลดเร็ว • ยิ่งมากยิ่งมีตัวเลือก
              </p>
            </div>
          </div>

          {/* ซ่อน/แสดงสถานี */}
          <div>
            <h3 className={`text-lg font-bold ${textPrimary} mb-3`}>จัดการสถานี</h3>

            {/* Tabs */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setActiveTab('with-coords')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'with-coords'
                    ? theme === 'dark'
                      ? 'bg-[#00ff41] text-black'
                      : 'bg-blue-600 text-white'
                    : theme === 'dark'
                      ? 'bg-white/5 hover:bg-white/10 text-white/60'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
              >
                จัดการสถานี ({stationsWithCoords.length})
              </button>
              <button
                onClick={() => setActiveTab('without-coords')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'without-coords'
                    ? theme === 'dark'
                      ? 'bg-[#00ff41] text-black'
                      : 'bg-blue-600 text-white'
                    : theme === 'dark'
                      ? 'bg-white/5 hover:bg-white/10 text-white/60'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
              >
                ไม่มีพิกัด ({stationsWithoutCoords.length})
              </button>
              <button
                onClick={() => setActiveTab('hidden-stations')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'hidden-stations'
                    ? theme === 'dark'
                      ? 'bg-orange-500 text-white'
                      : 'bg-orange-600 text-white'
                    : theme === 'dark'
                      ? 'bg-white/5 hover:bg-white/10 text-white/60'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
              >
                ถูกซ่อน ({hiddenStations.size})
              </button>
            </div>

            <p className={`text-sm ${textSecondary} mb-3`}>
              {activeTab === 'with-coords'
                ? `ซ่อนสถานีที่ไม่ต้องการ (${hiddenStations.size} สถานีถูกซ่อน)`
                : activeTab === 'without-coords'
                  ? 'สถานีเหล่านี้ไม่แสดงบน Globe เพราะไม่มีพิกัด แต่คุณสามารถฟังได้'
                  : 'สถานีที่ถูกซ่อน - คลิก 👁️ เพื่อแสดงกลับมา'
              }
            </p>

            {/* Search */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาสถานี..."
              className={`w-full px-4 py-2 rounded-lg border mb-3 ${theme === 'dark'
                  ? 'bg-white/5 border-white/10 text-white placeholder-white/40'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:ring-2 focus:ring-[#00ff41]/50`}
            />

            {/* Station List */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {filteredStations.map((station) => {
                const isHidden = hiddenStations.has(station.stationuuid);
                const isPreviewing = previewStation === station.stationuuid && isPreviewPlaying;
                return (
                  <div
                    key={station.stationuuid}
                    className={`p-3 rounded-lg border ${isHidden
                        ? theme === 'dark'
                          ? 'bg-red-500/10 border-red-500/20 opacity-50'
                          : 'bg-red-50 border-red-200 opacity-50'
                        : isPreviewing
                          ? theme === 'dark'
                            ? 'bg-[#00ff41]/10 border-[#00ff41]/30'
                            : 'bg-blue-50 border-blue-300'
                          : theme === 'dark'
                            ? 'bg-white/5 border-white/10'
                            : 'bg-gray-50 border-gray-200'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Play Preview Button */}
                      <button
                        onClick={() => handlePreview(station)}
                        className={`p-2 rounded-lg transition-all flex-shrink-0 ${isPreviewing
                            ? theme === 'dark'
                              ? 'bg-[#00ff41] text-black'
                              : 'bg-blue-600 text-white'
                            : theme === 'dark'
                              ? 'bg-white/10 hover:bg-white/20 text-white'
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                          }`}
                        title="ฟังตัวอย่าง"
                      >
                        {isPreviewing ? <Pause size={18} /> : <Play size={18} />}
                      </button>

                      {/* Station Info - คลิกเพื่อเล่นและหมุน Globe */}
                      <div
                        className="flex-1 min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => {
                          onSelectStation?.(station); // เล่นสถานี
                          if (station.geo_lat && station.geo_long) {
                            onFocusStation?.(station); // หมุน Globe
                          }
                        }}
                        title="คลิกเพื่อเล่นสถานี"
                      >
                        <h4 className={`font-semibold truncate ${textPrimary}`}>
                          {station.name}
                        </h4>
                        <p className={`text-xs truncate ${textSecondary}`}>
                          {station.country} • {station.bitrate || '?'} kbps
                        </p>
                        {station.tags && (
                          <p className={`text-xs truncate ${textSecondary} mt-1`}>
                            🎵 {station.tags}
                          </p>
                        )}
                      </div>

                      {/* Hide/Show Button */}
                      <button
                        onClick={() => toggleStationVisibility(station.stationuuid)}
                        className={`p-2 rounded-lg transition-colors flex-shrink-0 ${isHidden
                            ? 'text-red-500 hover:bg-red-500/20'
                            : accentColor + ' hover:' + accentBg
                          }`}
                        title={isHidden ? 'แสดงสถานี' : 'ซ่อนสถานี'}
                      >
                        {isHidden ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredStations.length === 0 && (
              <p className={`text-center py-8 ${textSecondary}`}>
                ไม่พบสถานี
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-white/10">
          <button
            onClick={() => {
              setHiddenStations(new Set());
              setMaxStations(1000);
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${theme === 'dark'
                ? 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
              }`}
          >
            รีเซ็ต
          </button>
          <button
            onClick={handleSave}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${theme === 'dark'
                ? 'bg-[#00ff41] text-black hover:shadow-[0_0_20px_rgba(0,255,65,0.5)]'
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;

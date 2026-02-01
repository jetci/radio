
import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Loader2, Heart, Search, Menu, Settings, Radio, Wifi, AlertTriangle, Share2, Check, EyeOff } from 'lucide-react';
import { Station } from '../types';
import { shareStation } from '../utils/shareStation';

interface AudioPlayerProps {
  station: Station | null;
  isPlaying: boolean;
  volume: number;
  onTogglePlay: () => void;
  onVolumeChange: (val: number) => void;
  onExploreClick: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onHideStation?: () => void;
  theme: 'dark' | 'light';
  isSettingsOpen?: boolean;
}

const WaveformVisualizer = ({ active }: { active: boolean }) => (
  <div className="flex items-end gap-[2px] h-3 w-8 overflow-hidden">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className={`w-full bg-red-500 transition-all duration-300 ${active ? 'animate-bounce-slow' : 'h-1 opacity-20'}`}
        style={{
          height: active ? `${Math.random() * 100}%` : '20%',
          animationDelay: `${i * 0.1}s`
        }}
      />
    ))}
    <style>{`
      @keyframes bounce-slow {
        0%, 100% { height: 20%; }
        50% { height: 100%; }
      }
      .animate-bounce-slow {
        animation: bounce-slow 0.6s ease-in-out infinite;
      }
    `}</style>
  </div>
);

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  station,
  isPlaying,
  volume,
  onTogglePlay,
  isFavorite,
  onToggleFavorite,
  onHideStation,
  onVolumeChange,
  onExploreClick,
  theme,
  isSettingsOpen = false
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorType, setErrorType] = useState<'none' | 'cors' | '404' | 'unknown'>('none');
  const [signalStrength, setSignalStrength] = useState(0);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const [shareSuccess, setShareSuccess] = useState(false);

  useEffect(() => {
    if (station && audioRef.current) {
      const audio = audioRef.current;
      setLoading(true);
      setErrorType('none');
      setSignalStrength(0);

      let streamUrl = station.url_resolved || station.url;
      if (window.location.protocol === 'https:' && streamUrl.startsWith('http:')) {
        streamUrl = streamUrl.replace('http:', 'https:');
      }

      // Stop any existing playback first
      const stopPlayback = async () => {
        if (playPromiseRef.current) {
          try {
            await playPromiseRef.current;
          } catch (e) {
            // Ignore errors from previous playback
          }
        }
        audio.pause();
      };

      stopPlayback().then(() => {
        audio.src = streamUrl;
        audio.load();

        if (isPlaying) {
          const playAttempt = async () => {
            try {
              await audio.play();
              setLoading(false);
            } catch (error) {
              // Suppress AbortError (happens when switching stations quickly)
              if (error instanceof Error && error.name !== 'AbortError') {
                console.error('Playback failed:', error);
              }
              setLoading(false);
              setErrorType('unknown');
            }
          };
          playPromiseRef.current = playAttempt() as any;
        }
      });
      setTimeout(() => setSignalStrength(Math.floor(Math.random() * 40) + 60), 800);
    }
  }, [station?.stationuuid, isPlaying]);

  // Removed duplicate useEffect - play/pause now handled in station change effect

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const handleAudioError = (e: any) => {
    setLoading(false);
    const code = e.target.error?.code;
    if (code === 4) setErrorType('cors');
    else if (code === 2) setErrorType('unknown');
    else setErrorType('404');
  };

  const handleShare = async () => {
    if (!station) return;
    const success = await shareStation(station);
    if (success) {
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    }
  };

  // Show placeholder when no station is selected
  if (!station) {
    return (
      <div className={`fixed bottom-[100px] left-6 z-50 pointer-events-none ${isSettingsOpen ? 'hidden' : 'block'}`}>
        <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 shadow-2xl pointer-events-auto flex items-center gap-3 animate-in slide-in-from-bottom-4 fade-in duration-500">
          <div className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse"></div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#00ff41]">
            Ready to Explore
          </span>
        </div>
      </div>
    );
  }

  const displayName = station.name.trim();
  const locationName = station.country || "Unknown Location";
  const isError = errorType !== 'none';

  return (
    <div className={`fixed bottom-[85px] left-0 w-full md:bottom-[100px] md:left-6 md:w-auto z-50 pointer-events-none flex flex-col items-center md:items-start gap-3 md:gap-4 ${isSettingsOpen ? 'hidden' : 'flex'}`}>
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onCanPlay={() => setLoading(false)}
        onError={handleAudioError}
        onLoadStart={() => setLoading(true)}
        onPlaying={() => setLoading(false)}
        onWaiting={() => setLoading(true)}
      />

      {/* RADIO GARDEN STYLE CARD - Compact */}
      <div className="w-[92%] md:w-[280px] pointer-events-auto" data-testid="audio-player-card">
        <div className={`bg-black/80 backdrop-blur-2xl border rounded-2xl p-3 md:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all group ${isError ? 'border-orange-500/50' : 'border-white/10 hover:border-white/20'}`}>

          {/* TOP ROW: CONTROLS */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                data-testid="audio-control-play"
                onClick={onTogglePlay}
                disabled={loading}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0 transition-all hover:scale-105 active:scale-95 ${isError ? 'bg-orange-500 text-white' : isPlaying ? 'bg-white text-black' : 'bg-white text-black pl-1'}`}
                aria-label={isPlaying ? 'Pause station' : 'Play station'}
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {loading ? <Loader2 size={18} className="animate-spin md:w-5 md:h-5" /> : isError ? <AlertTriangle size={18} className="md:w-5 md:h-5" /> : isPlaying ? <Pause size={18} className="md:w-5 md:h-5" fill="currentColor" /> : <Play size={18} className="md:w-5 md:h-5" fill="currentColor" />}
              </button>

              {/* Visualizer (Mini) */}
              {isPlaying && !loading && !isError && (
                <div className="h-6 flex items-end gap-0.5 opacity-50">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-1 bg-[#00ff41] animate-bounce" style={{ height: '100%', animationDuration: `${0.6 + i * 0.1}s` }}></div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1">
              {/* Hide Station Button */}
              {onHideStation && (
                <button
                  onClick={onHideStation}
                  className="p-2 rounded-full transition-all text-white/20 hover:text-orange-500 hover:bg-orange-500/10"
                  aria-label="Hide this station"
                  title="ซ่อนสถานีนี้">
                  <EyeOff size={18} />
                </button>
              )}

              <button
                data-testid="audio-control-favorite"
                onClick={onToggleFavorite}
                className={`p-2 rounded-full transition-all ${isFavorite ? 'text-red-500 bg-red-500/10' : 'text-white/20 hover:text-white hover:bg-white/10'}`}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
              </button>
              <button
                onClick={handleShare}
                className={`p-2 rounded-full transition-all ${shareSuccess ? 'text-green-500' : 'text-white/20 hover:text-white hover:bg-white/10'}`}
                aria-label="Share station"
                title="Share station">
                {shareSuccess ? <Check size={18} /> : <Share2 size={18} />}
              </button>
            </div>
          </div>

          {/* BOTTOM ROW: INFO */}
          <div className="space-y-0.5 md:space-y-1">
            <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold text-[#00ff41] uppercase tracking-wider">
              <span className="truncate max-w-[120px] md:max-w-[180px]">{locationName}</span>
              <div className="w-1 h-1 rounded-full bg-white/20"></div>
              <span>{station.bitrate || '128'} KBPS</span>
            </div>
            <h2 data-testid="active-station-title" className="text-base md:text-xl font-bold text-white leading-tight line-clamp-1 md:line-clamp-2" title={displayName}>
              {displayName}
            </h2>

            {/* Tag/Genre Hint */}
            {station.tags && (
              <div className="pt-2 flex flex-wrap gap-1">
                {station.tags.split(',').slice(0, 3).map(tag => (
                  <span key={tag} className="text-[9px] text-white/40 uppercase tracking-wide">#{tag.trim()}</span>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;

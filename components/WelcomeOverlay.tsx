import React from 'react';
import { Globe2, X, Play } from 'lucide-react';

interface WelcomeOverlayProps {
  onClose: () => void;
  onAutoTune: () => void;
  onOpenSidebar: () => void;
  theme: 'dark' | 'light';
  isAppLoading: boolean;
  loadingStatus: string;
}

const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({
  onClose,
  onAutoTune,
  onOpenSidebar,
  theme,
  isAppLoading,
  loadingStatus
}) => {
  const accentColor = theme === 'dark' ? '#00ff41' : '#3b82f6';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl animate-in fade-in duration-500">
      {/* Main Content */}
      <div className="max-w-lg mx-auto px-6 text-center animate-in zoom-in duration-500">
        {/* Icon */}
        <div
          className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 md:mb-8 rounded-full flex items-center justify-center animate-pulse"
          style={{
            backgroundColor: `${accentColor}20`,
            boxShadow: `0 0 40px ${accentColor}40`
          }}
        >
          <Globe2 className="w-12 h-12 md:w-16 md:h-16" style={{ color: accentColor }} />
        </div>

        {/* Title */}
        <h1
          className="text-3xl sm:text-4xl md:text-6xl font-black mb-4 md:mb-6 tracking-tight"
          style={{ color: accentColor }}
        >
          TongThin - Radio
        </h1>

        {/* Subtitle */}
        <p className={`text-xl md:text-3xl font-bold mb-3 md:mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          ฟังวิทยุจากทั่วทุกมุมโลก ฟรี !!
        </p>

        {/* Development Notice */}
        <p className={`text-sm md:text-lg mb-8 md:mb-12 ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>
          (กำลังอยู่ในขั้นตอนพัฒนา)
        </p>

        {/* Center Action Area: Radar while loading, Button when ready */}
        <div className="relative flex flex-col items-center gap-8 mx-auto mt-4 min-h-[180px] justify-center">
          {isAppLoading ? (
            <div className="flex flex-col items-center gap-6">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 border border-white/5 rounded-full"></div>
                <div className="absolute inset-4 border border-white/10 rounded-full"></div>
                <div className="absolute inset-8 border border-white/20 rounded-full"></div>
                <div
                  className="absolute inset-0 rounded-full border-t-2 border-r-2 border-transparent"
                  style={{
                    borderColor: `${accentColor} transparent transparent ${accentColor}`,
                    animation: 'spin 2s linear infinite',
                    boxShadow: `0 0 15px ${accentColor}40`
                  }}
                ></div>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }}></div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-mono tracking-[0.4em] uppercase opacity-40">Frequency Search</p>
                <p className="text-xl font-bold tracking-widest animate-pulse" style={{ color: accentColor }}>{loadingStatus}...</p>
              </div>
            </div>
          ) : (
            <button
              onClick={onClose}
              className="group relative px-12 py-6 rounded-full font-black text-2xl transition-all transform hover:scale-105 active:scale-95 shadow-2xl overflow-hidden animate-in zoom-in duration-500"
              style={{
                backgroundColor: accentColor,
                color: theme === 'dark' ? '#000' : '#fff',
                boxShadow: `0 20px 50px ${accentColor}40`
              }}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer-fast"></div>

              <div className="flex items-center gap-4 relative z-10">
                <Play size={24} fill="currentColor" />
                <span>GET STARTED</span>
              </div>
            </button>
          )}
        </div>
      </div>
      <style>{`
        @keyframes shimmer-fast {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .group-hover\\:animate-shimmer-fast {
          animation: shimmer-fast 1s infinite;
        }
      `}</style>
    </div>
  );
};

export default WelcomeOverlay;

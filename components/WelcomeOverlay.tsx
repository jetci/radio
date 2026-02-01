import React from 'react';
import { Globe2, X, Play } from 'lucide-react';

interface WelcomeOverlayProps {
  onClose: () => void;
  onAutoTune: () => void;
  onOpenSidebar: () => void;
  theme: 'dark' | 'light';
}

const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({
  onClose,
  onAutoTune,
  onOpenSidebar,
  theme
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

        {/* Get Started Button */}
        <button
          data-testid="welcome-start-btn"
          onClick={onClose}
          className="group px-8 py-4 md:px-12 md:py-5 rounded-full font-black text-lg md:text-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 md:gap-4 mx-auto shadow-2xl"
          style={{
            backgroundColor: accentColor,
            color: theme === 'dark' ? '#000' : '#fff',
            boxShadow: `0 15px 40px ${accentColor}50`
          }}
        >
          <Play size={20} className="md:w-6 md:h-6" fill="currentColor" />
          Get Started
        </button>
      </div>
    </div>
  );
};

export default WelcomeOverlay;

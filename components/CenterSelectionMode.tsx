import React from 'react';
import { Play, Target } from 'lucide-react';
import { Station } from '../types';

interface CenterSelectionModeProps {
  nearestStation: Station | null;
  onSelect: () => void;
  theme: 'dark' | 'light';
}

const CenterSelectionMode: React.FC<CenterSelectionModeProps> = ({
  nearestStation,
  onSelect,
  theme
}) => {
  const accentColor = theme === 'dark' ? 'text-[#00ff41]' : 'text-blue-600';
  const bgColor = theme === 'dark' ? 'bg-black/90' : 'bg-white/90';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';

  return (
    <>
      {/* Crosshair - อยู่กลางจอตลอดเวลา */}
      <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center">
        <div className="relative">
          <Target 
            size={48} 
            className={`${nearestStation ? accentColor : 'text-white/20'} transition-colors`}
            strokeWidth={1.5}
          />
          {nearestStation && (
            <div className={`absolute inset-0 flex items-center justify-center`}>
              <div className={`w-12 h-12 rounded-full border-2 ${theme === 'dark' ? 'border-[#00ff41]' : 'border-blue-600'} animate-ping opacity-50`}></div>
            </div>
          )}
        </div>
      </div>

      {/* Station Info & Play Button - แสดงเมื่อเจอสถานี */}
      {nearestStation && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
          <div className={`${bgColor} backdrop-blur-xl border ${theme === 'dark' ? 'border-white/20' : 'border-gray-300'} rounded-2xl p-4 shadow-2xl min-w-[280px] max-w-[90vw]`}>
            {/* Station Info */}
            <div className="mb-3 text-center">
              <h3 className={`font-bold text-lg truncate ${textColor}`}>
                {nearestStation.name}
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'} truncate`}>
                📍 {nearestStation.country}
              </p>
              {nearestStation.tags && (
                <p className={`text-xs ${theme === 'dark' ? 'text-white/40' : 'text-gray-500'} truncate mt-1`}>
                  🎵 {nearestStation.tags}
                </p>
              )}
            </div>

            {/* Play Button */}
            <button
              onClick={onSelect}
              className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                theme === 'dark'
                  ? 'bg-[#00ff41] text-black hover:bg-[#00ff41]/90'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Play size={20} fill="currentColor" />
              <span>เล่น</span>
            </button>

            {/* Hint */}
            <p className={`text-xs text-center mt-2 ${theme === 'dark' ? 'text-white/40' : 'text-gray-500'}`}>
              หมุนโลกเพื่อเปลี่ยนสถานี
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default CenterSelectionMode;

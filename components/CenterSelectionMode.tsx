import React from 'react';
import { Target, Check } from 'lucide-react';
import { Station } from '../types';

interface CenterSelectionModeProps {
  isActive: boolean;
  nearestStation: Station | null;
  onSelect: () => void;
  theme: 'dark' | 'light';
}

const CenterSelectionMode: React.FC<CenterSelectionModeProps> = ({
  isActive,
  nearestStation,
  onSelect,
  theme
}) => {
  if (!isActive) return null;

  const bgColor = theme === 'dark' ? 'bg-black/80' : 'bg-white/80';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const accentColor = theme === 'dark' ? 'text-[#00ff41]' : 'text-blue-600';
  const borderColor = theme === 'dark' ? 'border-white/20' : 'border-gray-300';

  return (
    <>
      {/* Center Crosshair */}
      <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center">
        <div className="relative w-24 h-24">
          {/* Crosshair */}
          <div className={`absolute inset-0 flex items-center justify-center`}>
            <Target 
              size={64} 
              className={`${nearestStation ? accentColor : 'text-white/30'} transition-colors`}
              strokeWidth={1.5}
            />
          </div>
          
          {/* Pulsing ring when station is centered */}
          {nearestStation && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-20 h-20 rounded-full border-2 ${theme === 'dark' ? 'border-[#00ff41]' : 'border-blue-600'} animate-ping opacity-75`}></div>
            </div>
          )}
        </div>
      </div>

      {/* Station Info & Select Button */}
      {nearestStation && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
          <div className={`${bgColor} backdrop-blur-xl ${borderColor} border rounded-2xl p-4 shadow-2xl min-w-[280px] max-w-[90vw]`}>
            {/* Station Info */}
            <div className="mb-3">
              <h3 className={`font-bold text-lg truncate ${textColor}`}>
                {nearestStation.name}
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'} truncate`}>
                {nearestStation.country}
              </p>
              {nearestStation.tags && (
                <p className={`text-xs ${theme === 'dark' ? 'text-white/40' : 'text-gray-500'} truncate mt-1`}>
                  {nearestStation.tags}
                </p>
              )}
            </div>

            {/* Select Button */}
            <button
              onClick={onSelect}
              className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                theme === 'dark'
                  ? 'bg-[#00ff41] text-black hover:bg-[#00ff41]/90'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Check size={20} />
              <span>Select Station</span>
            </button>

            {/* Hint */}
            <p className={`text-xs text-center mt-2 ${theme === 'dark' ? 'text-white/40' : 'text-gray-500'}`}>
              Rotate globe to change station
            </p>
          </div>
        </div>
      )}

      {/* Instructions (show when no station centered) */}
      {!nearestStation && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className={`${bgColor} backdrop-blur-xl ${borderColor} border rounded-2xl px-6 py-3 shadow-2xl`}>
            <p className={`text-sm ${textColor} text-center`}>
              🌍 Rotate globe to select a station
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default CenterSelectionMode;

import React from 'react';
import { Globe2, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// Station List Skeleton
export const StationSkeleton: React.FC = () => (
  <div className="animate-pulse space-y-3">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
        <div className="w-10 h-10 bg-white/10 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-white/10 rounded w-3/4"></div>
          <div className="h-3 bg-white/10 rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
);

// Globe Loading Skeleton
export const GlobeSkeleton: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="text-center">
        {/* Spinning Globe Icon */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00ff41]/20 to-transparent animate-pulse"></div>
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#00ff41]/10 to-transparent animate-pulse delay-75"></div>
          <div className="absolute inset-8 rounded-full bg-gradient-to-br from-[#00ff41]/5 to-transparent animate-pulse delay-150"></div>
          <Globe2 
            className="absolute inset-0 m-auto text-[#00ff41] animate-spin-slow" 
            size={64}
            style={{ animationDuration: '3s' }}
          />
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl font-bold text-white mb-2">
          {t('globe.loading')}
        </h2>
        <p className="text-white/60 mb-6">
          {t('common.loading')}
        </p>

        {/* Progress Bar */}
        <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-gradient-to-r from-[#00ff41] to-blue-500 animate-progress"></div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-progress {
          animation: progress 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// Card Skeleton (for settings, etc.)
export const CardSkeleton: React.FC = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-6 bg-white/10 rounded w-1/3"></div>
    <div className="space-y-2">
      <div className="h-4 bg-white/10 rounded"></div>
      <div className="h-4 bg-white/10 rounded w-5/6"></div>
      <div className="h-4 bg-white/10 rounded w-4/6"></div>
    </div>
  </div>
);

// Loading Spinner (inline)
export const LoadingSpinner: React.FC<{ size?: number; className?: string }> = ({ 
  size = 24, 
  className = '' 
}) => (
  <Loader2 
    size={size} 
    className={`animate-spin text-[#00ff41] ${className}`} 
  />
);

// Loading Dots
export const LoadingDots: React.FC = () => (
  <div className="flex items-center gap-1">
    <div className="w-2 h-2 bg-[#00ff41] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
    <div className="w-2 h-2 bg-[#00ff41] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
    <div className="w-2 h-2 bg-[#00ff41] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
  </div>
);

// Loading Overlay (for partial page loading)
export const LoadingOverlay: React.FC<{ message?: string }> = ({ message }) => {
  const { t } = useLanguage();

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-40">
      <div className="text-center">
        <LoadingSpinner size={48} className="mx-auto mb-4" />
        <p className="text-white/80">
          {message || t('common.loading')}
        </p>
      </div>
    </div>
  );
};

export default {
  StationSkeleton,
  GlobeSkeleton,
  CardSkeleton,
  LoadingSpinner,
  LoadingDots,
  LoadingOverlay
};

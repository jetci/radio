import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ErrorFallbackProps {
  error: Error | null;
  resetError: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  const { language } = useLanguage();

  const messages = {
    th: {
      title: 'เกิดข้อผิดพลาด',
      subtitle: 'ขออภัย เกิดข้อผิดพลาดที่ไม่คาดคิด',
      details: 'รายละเอียดข้อผิดพลาด',
      retry: 'ลองใหม่',
      home: 'กลับหน้าแรก'
    },
    en: {
      title: 'Something went wrong',
      subtitle: 'Sorry, an unexpected error occurred',
      details: 'Error details',
      retry: 'Try Again',
      home: 'Go Home'
    }
  };

  const t = messages[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-black flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-black/50 backdrop-blur-xl rounded-2xl border border-red-500/20 p-8 text-center shadow-2xl">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        
        {/* Title */}
        <h1 className="text-2xl font-bold text-white mb-2">
          {t.title}
        </h1>
        
        {/* Subtitle */}
        <p className="text-white/60 mb-6">
          {t.subtitle}
        </p>
        
        {/* Error Details */}
        {error && (
          <details className="mb-6 text-left">
            <summary className="text-red-400 cursor-pointer mb-2 text-sm font-medium hover:text-red-300 transition-colors">
              {t.details}
            </summary>
            <pre className="text-xs text-white/40 bg-black/30 p-4 rounded-lg overflow-auto max-h-32 border border-white/5">
              {error.toString()}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
        
        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={resetError}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-bold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg"
          >
            <RefreshCw size={20} />
            {t.retry}
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-bold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <Home size={20} />
            {t.home}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;

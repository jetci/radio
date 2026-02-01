import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  theme: 'dark' | 'light';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'ตกลง',
  cancelText = 'ยกเลิก',
  onConfirm,
  onCancel,
  theme
}) => {
  if (!isOpen) return null;

  const bgColor = theme === 'dark' ? 'bg-black/95 border-white/10' : 'bg-white/95 border-gray-200';
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-white/70' : 'text-gray-600';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`w-full max-w-md m-4 rounded-2xl border shadow-2xl ${bgColor} overflow-hidden animate-in zoom-in duration-200`}>
        {/* Icon & Title */}
        <div className="p-6 pb-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-orange-500/10">
              <AlertTriangle size={24} className="text-orange-500" />
            </div>
            <div className="flex-1">
              <h3 className={`text-xl font-bold ${textPrimary} mb-2`}>
                {title}
              </h3>
              <p className={`text-sm ${textSecondary} leading-relaxed`}>
                {message}
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 p-6 pt-4 border-t border-white/10">
          <button
            onClick={onCancel}
            className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
              theme === 'dark'
                ? 'bg-white/5 hover:bg-white/10 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
            }`}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 rounded-xl font-semibold transition-all bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

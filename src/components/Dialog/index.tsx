import React from 'react';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  onConfirm?: () => void;
  showFooter?: boolean;
};

export default function Dialog({ open, onOpenChange, children, onConfirm, showFooter = true }: Props) {
  if (!open) {
    return null;
  }

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-50" onClick={handleCancel} />
      <div className="bg-white rounded-2xl p-6 w-80 mx-4 z-1">
        {children}
        {showFooter && (
          <div className="flex gap-3 mt-6">
            <button
              className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
              onClick={handleCancel}
            >
              取消
            </button>
            <button
              className="flex-1 py-3 bg-indigo-500 text-white font-medium rounded-xl hover:bg-indigo-600 transition-colors"
              onClick={onConfirm}
            >
              確認
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
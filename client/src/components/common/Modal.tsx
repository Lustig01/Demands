import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MdClose } from 'react-icons/md';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-bg-paper rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto mx-4">
        <div className="flex items-center justify-between p-6 border-b border-divider">
          <h2 className="text-xl font-bold text-text-primary m-0">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-text-secondary hover:bg-gray-100 hover:text-text-primary transition-colors bg-transparent border-none cursor-pointer"
          >
            <MdClose size={22} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body
  );
}

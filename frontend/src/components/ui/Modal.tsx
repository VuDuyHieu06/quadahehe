import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={cn('relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl')}>
        {title && <h3 className="mb-4 text-lg font-bold text-gray-900">{title}</h3>}
        {children}
      </div>
    </div>
  );
}

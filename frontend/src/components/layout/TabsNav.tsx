// Chỉ "Lưu trý" sẵn sàng; "Thuê xe" hoạt động nhưng hiển thị Coming Soon.
import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

const TABS = [
  { key: 'stays', label: 'Lưu trú' },
  { key: 'car', label: 'Thuê xe' },
];

export function TabsNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <nav className="flex gap-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => t.key === 'car' && setOpen(true)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              t.key === 'stays'
                ? 'bg-white text-gray-900 shadow'
                : 'bg-white/20 text-white/80 hover:bg-white/30'
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <Modal open={open} onClose={() => setOpen(false)} title="Tính năng sắp ra mắt 🚗">
        <div className="text-center">
          <div className="mb-3 text-5xl">🚘</div>
          <p className="mb-1 text-gray-700">
            Dịch vụ <b>Thuê xe</b> đang được phát triển và sẽ sớm ra mắt trên Radiant Hope.
          </p>
          <p className="mb-5 text-sm text-gray-500">Cám ơn bạn đã quan tâm!</p>
          <Button onClick={() => setOpen(false)}>Tôi đã hiểu</Button>
        </div>
      </Modal>
    </>
  );
}

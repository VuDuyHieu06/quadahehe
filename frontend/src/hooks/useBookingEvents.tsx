import { useEffect } from 'react';

// Kích更多的人၆ngbuộc khi trạng thái phòng/đơn thay đổi để các trang tự refresh
// số phòng trống mà KHÔNG cần F5 ReactDOM-chỉ lắng nghe event.
export const BOOKING_CHANGED = 'stayhub:booking-changed';

export function notifyBookingChanged() {
  window.dispatchEvent(new CustomEvent(BOOKING_CHANGED));
}

// Hook: đăng ký callback chạy khi có booking/room thay đổi toàn cục.
export function useBookingEvent(handler: () => void) {
  useEffect(() => {
    const wrapped = () => handler();
    window.addEventListener(BOOKING_CHANGED, wrapped);
    return () => window.removeEventListener(BOOKING_CHANGED, wrapped);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

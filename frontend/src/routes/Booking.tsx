import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { hotelApi, roomApi, bookingApi } from '../api';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../components/ui/Toast';
import { notifyBookingChanged } from '../hooks/useBookingEvents';
import { formatVND, nights } from '../lib/format';

export function Booking() {
  const { roomTypeId } = useParams<{ roomTypeId: string }>();
  const [params] = useSearchParams();
  const checkIn = params.get('checkIn') ?? new Date().toISOString().slice(0, 10);
  const checkOut = params.get('checkOut') ?? new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const navigate = useNavigate();
  const toast = useToast();

  const [hotel, setHotel] = useState<Awaited<ReturnType<typeof hotelApi.detail>> | null>(null);
  const [roomType, setRoomType] = useState<Awaited<ReturnType<typeof hotelApi.detail>>['roomTypes'][number] | null>(null);
  const [freeRooms, setFreeRooms] = useState<{ room_id: number; room_number: string }[]>([]);
  const [chosen, setChosen] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancel = false;
    (async () => {
      // Lấy chi tiết hotel, tìm roomType, rồi lấy phòng trống
      if (!roomTypeId) return;
      // cần hotel — fetching qua hotelApi.detail nhưng cần hotel_id. Ta fetch room loại:
      const rooms = await roomApi.byType(Number(roomTypeId));
      // Tìm room_type qua rooms (room.room_type_id). Cần giá/capacity -> gọi admin? dùng endpoint available.
      const free = await roomApi.available(Number(roomTypeId), checkIn, checkOut).catch(() => []);
      if (cancel) return;
      setFreeRooms(free);
      setLoading(false);
    })();
    return () => { cancel = true; };
  }, [roomTypeId, checkIn, checkOut]);

  const submit = async () => {
    if (chosen == null) {
      toast.push('Vui lòng chọn phòng.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await bookingApi.create({ room_type_id: Number(roomTypeId), room_id: chosen, check_in_date: checkIn, check_out_date: checkOut });
      // Báo toàn cục để các trang đang mở (Search, HotelDetail) tự refresh
      // số phòng trống ngay lập tức — không cần F5.
      notifyBookingChanged();
      toast.push('Đặt phòng thành công! Đơn đang chờ duyệt.', 'success');
      void navigate('/my-bookings');
    } catch (err) {
      toast.push(err instanceof Error ? err.message : 'Đặt phòng thất bại.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-32"><Spinner className="h-8 w-8" /></div>;

  const n = nights(checkIn, checkOut);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Xác nhận đặt phòng</h1>

      <div className="mb-4 rounded-xl bg-brand-50 p-4 text-sm">
        <div className="flex justify-between"><span>Nhận phòng:</span><b>{checkIn}</b></div>
        <div className="flex justify-between"><span>Trả phòng:</span><b>{checkOut}</b></div>
      </div>

      <section className="mb-6">
        <h2 className="mb-3 font-bold text-gray-900">Chọn phòng trống</h2>
        {freeRooms.length === 0 ? (
          <p className="text-gray-500">Không còn phòng trống trong khoảng ngày này.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {freeRooms.map((r) => (
              <button
                key={r.room_id}
                onClick={() => setChosen(r.room_id)}
                className={`rounded-xl border-2 p-4 text-center transition ${chosen === r.room_id ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <div className="text-lg font-bold text-gray-900">Phòng {r.room_number}</div>
                {chosen === r.room_id && <Badge color="brand">Đã chọn</Badge>}
              </button>
            ))}
          </div>
        )}
      </section>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="mb-3 font-bold text-gray-900">Thông tin thanh toán</h3>
        <div className="mb-4 flex justify-between text-sm text-gray-600">
          <span>{n} đêm × giá/đêm</span>
          <span>{formatVND(null)}</span>
        </div>
        <Button className="w-full" disabled={chosen == null || submitting} onClick={() => void submit()}>
          {submitting ? 'Đang đặt...' : 'Xác nhận đặt phòng'}
        </Button>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roomApi, bookingApi } from '../api';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../components/ui/Toast';
import { notifyBookingChanged } from '../hooks/useBookingEvents';
import { formatVND, nights } from '../lib/format';

export function Booking() {
  const { roomTypeId } = useParams<{ roomTypeId: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const getTodayDate = () => new Date().toISOString().slice(0, 10);
  const getTomorrowDate = () => new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const [checkIn, setCheckIn] = useState(getTodayDate());
  const [checkOut, setCheckOut] = useState(getTomorrowDate());
  const [freeRooms, setFreeRooms] = useState<{ room_id: number; room_number: string; room_type_id: number; price_per_night: number }[]>([]);
  const [chosen, setChosen] = useState<number | null>(null);
  const [chosenPrice, setChosenPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);

  const totalNights = nights(checkIn, checkOut);
  const totalPrice = chosenPrice && totalNights > 0 ? totalNights * chosenPrice : null;
  const isValidDateRange = totalNights > 0;
  const canSubmit = chosen != null && isValidDateRange && !dateError;

  useEffect(() => {
    let isMounted = true;

    const fetchAvailableRooms = async () => {
      setLoading(true);

      try {
        if (!roomTypeId) {
          toast.push('Lỗi: Không tìm thấy loại phòng.', 'error');
          return;
        }

        const free = await roomApi.available(Number(roomTypeId), checkIn, checkOut);
        if (isMounted) {
          setFreeRooms(free);
          setChosen(null);
          setChosenPrice(null);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Lỗi khi tải danh sách phòng.';
        if (isMounted) {
          toast.push(message, 'error');
          console.error('Error fetching available rooms:', err);
          setFreeRooms([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchAvailableRooms();

    return () => {
      isMounted = false;
    };
  }, [roomTypeId, checkIn, checkOut, toast]);

  const handleCheckInChange = (newCheckIn: string) => {
    const today = getTodayDate();
    if (newCheckIn < today) {
      setDateError('Ngày nhận phòng không thể trong quá khứ.');
      return;
    }
    setCheckIn(newCheckIn);
    setDateError(null);
    if (newCheckIn >= checkOut) {
      setDateError('Ngày trả phòng phải sau ngày nhận phòng.');
    }
  };

  const handleCheckOutChange = (newCheckOut: string) => {
    if (newCheckOut <= checkIn) {
      setDateError('Ngày trả phòng phải sau ngày nhận phòng.');
      return;
    }
    setCheckOut(newCheckOut);
    setDateError(null);
  };

  const submit = async () => {
    if (chosen == null) {
      toast.push('Vui lòng chọn phòng.', 'error');
      return;
    }

    if (!roomTypeId) {
      toast.push('Lỗi: Không tìm thấy loại phòng.', 'error');
      return;
    }

    if (dateError) {
      toast.push(dateError, 'error');
      return;
    }

    setSubmitting(true);
    try {
      await bookingApi.create({
        room_type_id: Number(roomTypeId),
        room_id: chosen,
        check_in_date: checkIn,
        check_out_date: checkOut,
      });
      notifyBookingChanged();
      toast.push('Đặt phòng thành công! Đơn đang chờ duyệt.', 'success');
      navigate('/my-bookings');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Đặt phòng thất bại.';
      toast.push(message, 'error');
      console.error('Error creating booking:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!roomTypeId) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-lg bg-red-50 p-4 text-center">
          <p className="mb-4 text-red-700">Lỗi: Không tìm thấy loại phòng.</p>
          <Button onClick={() => navigate(-1)}>Quay lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Xác nhận đặt phòng</h1>

      <section className="mb-6">
        <h2 className="mb-3 font-bold text-gray-900">Thời gian đặt phòng</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày nhận phòng</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => handleCheckInChange(e.target.value)}
              min={getTodayDate()}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày trả phòng</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => handleCheckOutChange(e.target.value)}
              min={checkIn}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>
        {dateError && <p className="mt-2 text-sm text-red-600">{dateError}</p>}
      </section>

      {loading ? (
        <div className="flex justify-center py-8">
          <Spinner className="h-6 w-6" />
        </div>
      ) : (
        <section className="mb-6">
          <h2 className="mb-3 font-bold text-gray-900">Chọn phòng trống</h2>
          {freeRooms.length === 0 ? (
            <p className="text-gray-500">Không còn phòng trống trong khoảng thời gian đã chọn.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {freeRooms.map((r) => (
                <button
                  key={r.room_id}
                  onClick={() => {
                    setChosen(r.room_id);
                    setChosenPrice(r.price_per_night);
                  }}
                  className={`rounded-xl border-2 p-4 text-center transition ${
                    chosen === r.room_id ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-lg font-bold text-gray-900">Phòng {r.room_number}</div>
                  {chosen === r.room_id && <Badge color="brand">Đã chọn</Badge>}
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="mb-3 font-bold text-gray-900">Thông tin thanh toán</h3>
        <div className="mb-4 space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>
              {totalNights} đêm × {chosenPrice ? formatVND(chosenPrice) : '—'}
            </span>
            <span>{chosenPrice ? formatVND(chosenPrice * totalNights) : '—'}</span>
          </div>
          <div className="border-t border-gray-200 pt-2 font-semibold text-gray-900">
            <div className="flex justify-between">
              <span>Tổng tiền</span>
              <span>{totalPrice ? formatVND(totalPrice) : '—'}</span>
            </div>
          </div>
        </div>
        <Button
          className="w-full"
          disabled={!canSubmit}
          onClick={() => void submit()}
        >
          {submitting ? 'Đang đặt...' : 'Xác nhận đặt phòng'}
        </Button>
      </div>
    </div>
  );
}

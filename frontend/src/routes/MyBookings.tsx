import { Link } from 'react-router-dom';
import { bookingApi } from '../api';
import { useFetch } from '../hooks/useFetch';
import { useAuthStore } from '../store/authStore';
import { Spinner } from '../components/ui/Spinner';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { formatVND } from '../lib/format';

const STATUS_COLOR: Record<string, 'amber' | 'green' | 'red' | 'blue'> = {
  pending: 'amber', confirmed: 'green', cancelled: 'red', completed: 'blue',
};
const STATUS_LABEL: Record<string, string> = {
  pending: 'Chờ duyệt', confirmed: 'Đã xác nhận', cancelled: 'Đã huỷ', completed: 'Hoàn thành',
};

export function MyBookings() {
  const { user } = useAuthStore();
  const { data, loading, refetch } = useFetch(() => bookingApi.my(), []);

  if (loading) return <div className="flex justify-center py-32"><Spinner className="h-8 w-8" /></div>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Đơn đặt của tôi</h1>
        <Button variant="secondary" size="sm" onClick={() => void refetch()}>↻ Làm mới</Button>
      </div>

      {(!data || data.length === 0) ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <div className="mb-3 text-5xl">🛎️</div>
          <p className="mb-1 text-lg font-semibold text-gray-700">Bạn chưa có đơn đặt nào</p>
          <p className="mb-5 text-sm text-gray-500">
            {user ? 'Hãy tìm chỗ nghỉ và đặt phòng ngay nhé!' : 'Vui lòng đăng nhập để xem đơn đặt của bạn.'}
          </p>
          <Link to="/search"><Button>Tìm phòng ngay</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((b) => {
            const hotel = b.room?.roomType?.hotel as any;
            return (
              <div key={b.booking_id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap justify-between gap-2">
                  <div>
                    <div className="font-bold text-gray-900">{hotel?.name ?? 'Khách sạn'}</div>
                    <div className="text-sm text-gray-500">
                      Phòng {b.room?.room_number} — {b.room?.roomType?.name}
                    </div>
                  </div>
                  <Badge color={STATUS_COLOR[b.status]}>{STATUS_LABEL[b.status]}</Badge>
                </div>
                <div className="mt-3 flex flex-wrap justify-between gap-2 text-sm text-gray-600">
                  <span>Nhận: {new Date(b.check_in_date).toLocaleDateString('vi-VN')}</span>
                  <span>Trả: {new Date(b.check_out_date).toLocaleDateString('vi-VN')}</span>
                  <span className="font-bold text-brand-600">{formatVND(Number(b.total_price))}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

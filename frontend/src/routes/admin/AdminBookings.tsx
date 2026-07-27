import { useState } from 'react';
import { bookingApi } from '../../api';
import { notifyBookingChanged } from '../../hooks/useBookingEvents';
import { useFetch } from '../../hooks/useFetch';
import { Spinner } from '../../components/ui/Spinner';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { formatVND } from '../../lib/format';

const STATUS_COLOR: Record<string, any> = { pending: 'amber', confirmed: 'green', cancelled: 'red', completed: 'blue' };
const STATUS_LABEL: Record<string, string> = { pending: 'Chờ duyệt', confirmed: 'Đã xác nhận', cancelled: 'Đã huỷ', completed: 'Hoàn thành' };

export function AdminBookings() {
  const { data, loading, refetch } = useFetch(() => bookingApi.all(), []);
  const toast = useToast();
  const [busy, setBusy] = useState<number | null>(null);

  const change = async (id: number, status: string) => {
    setBusy(id);
    try {
      await bookingApi.updateStatus(id, status);
      toast.push('Đã cập nhật trạng thái.', 'success');
      void refetch();
      notifyBookingChanged();
    } catch (err) {
      toast.push(err instanceof Error ? err.message : 'Thất bại.', 'error');
    } finally {
      setBusy(null);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner className="h-7 w-7" /></div>;

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-gray-900">Danh sách đơn đặt</h2>
      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="p-3">#</th><th className="p-3">Khách</th><th className="p-3">Khách sạn / Phòng</th>
              <th className="p-3">Nhận</th><th className="p-3">Trả</th><th className="p-3">Tổng</th>
              <th className="p-3">Trạng thái</th><th className="p-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((b) => (
              <tr key={b.booking_id} className="border-t border-gray-100">
                <td className="p-3">{b.booking_id}</td>
                <td className="p-3">{b.user?.full_name}</td>
                <td className="p-3">{b.room?.roomType?.hotel?.name}<br />Phòng {b.room?.room_number} ({b.room?.roomType?.name})</td>
                <td className="p-3">{new Date(b.check_in_date).toLocaleDateString('vi-VN')}</td>
                <td className="p-3">{new Date(b.check_out_date).toLocaleDateString('vi-VN')}</td>
                <td className="p-3 font-semibold">{formatVND(Number(b.total_price))}</td>
                <td className="p-3"><Badge color={STATUS_COLOR[b.status]}>{STATUS_LABEL[b.status]}</Badge></td>
                <td className="p-3">
                  <Select disabled={busy === b.booking_id} onChange={(e) => void change(b.booking_id, e.target.value)} className="py-1.5 text-xs">
                    <option value="">-- đổi --</option>
                    <option value="confirmed">Duyệt</option>
                    <option value="cancelled">Huỷ</option>
                    <option value="completed">Hoàn thành</option>
                  </Select>
                </td>
              </tr>
            ))}
            {(!data || data.length === 0) && <tr><td colSpan={8} className="p-6 text-center text-gray-500">Chưa có đơn nào.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

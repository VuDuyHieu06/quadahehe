import { adminApi, bookingApi } from '../../api';
import { useFetch } from '../../hooks/useFetch';
import { Spinner } from '../../components/ui/Spinner';

export function Dashboard() {
  const hotels = useFetch(() => adminApi.listHotels(), []);
  const bookings = useFetch(() => bookingApi.all(), []);
  const pending = bookings.data?.filter((b) => b.status === 'pending').length ?? 0;
  const revenue =
    bookings.data?.filter((b) => b.status === 'confirmed').reduce((s, b) => s + Number(b.total_price), 0) ?? 0;

  if (hotels.loading || bookings.loading) return <div className="flex justify-center py-20"><Spinner className="h-7 w-7" /></div>;

  const cards = [
    { label: 'Khách sạn', value: hotels.data?.length ?? 0, color: 'text-blue-600' },
    { label: 'Đơn đặt', value: bookings.data?.length ?? 0, color: 'text-gray-900' },
    { label: 'Chờ duyệt', value: pending, color: 'text-amber-600' },
    { label: 'Doanh thu xác nhận', value: `${revenue.toLocaleString('vi-VN')}₫`, color: 'text-green-600' },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="text-sm text-gray-500">{c.label}</div>
            <div className={`mt-1 text-2xl font-bold ${c.color}`}>{c.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

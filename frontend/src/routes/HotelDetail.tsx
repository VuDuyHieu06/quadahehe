import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { hotelApi, reviewApi, roomApi } from '../api';
import { useFetch } from '../hooks/useFetch';
import { useBookingEvent } from '../hooks/useBookingEvents';
import { ImageGallery } from '../components/hotel/ImageGallery';
import { ReviewModal } from '../components/hotel/ReviewModal';
import { Badge } from '../components/ui/Badge';
import { StarRating } from '../components/ui/StarRating';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { formatVND } from '../lib/format';
import { useAuthStore } from '../store/authStore';

export function HotelDetail() {
  const { id } = useParams<{ id: string }>();
  const [params] = useSearchParams();
  const checkIn = params.get('checkIn') ?? '';
  const checkOut = params.get('checkOut') ?? '';
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { data: hotel, loading, refetch } = useFetch(() => hotelApi.detail(Number(id)), [id]);
  const { data: reviews } = useFetch(() => reviewApi.list(Number(id)), [id]);
  const [reviewOpen, setReviewOpen] = useState(false);
  // Số phòng trống cho từng RoomType trong khoảng ngày (mặc định hôm nay -> ngày mai).
  const [freeCounts, setFreeCounts] = useState<Record<number, number>>({});
  const baseCheckIn = checkIn || new Date().toISOString().slice(0, 10);
  const baseCheckOut = checkOut || new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const reloadFree = async (hotelData: typeof hotel) => {
    if (!hotelData) return;
    const counts: Record<number, number> = {};
    await Promise.all(
      hotelData.roomTypes.map(async (rt) => {
        try {
          const free = await roomApi.available(rt.room_type_id, baseCheckIn, baseCheckOut);
          counts[rt.room_type_id] = free.length;
        } catch {
          counts[rt.room_type_id] = 0;
        }
      }),
    );
    setFreeCounts(counts);
  };

  // Khi khách sạn load xong -> tính số phòng trống từng loại.
  useEffect(() => {
    void reloadFree(hotel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotel, baseCheckIn, baseCheckOut]);

  // Lắng nghe event toàn cục: khi đặt phòng / admin đổi phòng -> tự re-fetch,
  // cập nhật số phòng trống NGAY LẬP TỨC mà không F5.
  useBookingEvent(() => {
    void refetch();
    void reloadFree(hotel);
  });

  if (loading) return <div className="flex justify-center py-32"><Spinner className="h-8 w-8" /></div>;
  if (!hotel) return <p className="py-32 text-center text-gray-500">Không tìm thấy khách sạn.</p>;

  const book = (roomTypeId: number) => {
    if (!user) {
      void navigate('/login');
      return;
    }
    const q = new URLSearchParams({ checkIn, checkOut });
    void navigate(`/booking/${roomTypeId}?${q.toString()}`);
  };

  const TYPE_LABEL: Record<string, string> = { HOTEL: 'Khách sạn', RESORT: 'Resort', VILLA: 'Biệt thự', APARTMENT: 'Căn hộ' };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Link to="/search" className="mb-4 inline-block text-sm font-medium text-brand-600 hover:underline">← Quay lại kết quả</Link>

      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge color="brand">{TYPE_LABEL[hotel.property_type]}</Badge>
          {hotel.star_rating > 0 && <StarRating value={hotel.star_rating} />}
        </div>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">{hotel.name}</h1>
        <p className="text-gray-500">�1 {hotel.city} — {hotel.address}</p>
      </div>

      <ImageGallery images={hotel.images} name={hotel.name} />

      <div className="mt-6 flex flex-wrap gap-2">
        {hotel.amenities.map((a) => (
          <Badge key={a.amenity.amenity_id} color="green">✓ {a.amenity.name}</Badge>
        ))}
      </div>

      {hotel.description && <p className="mt-6 text-gray-700">{hotel.description}</p>}

      {/* Room Types */}
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Loại phòng khả dụng</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {hotel.roomTypes.map((rt) => (
            <div key={rt.room_type_id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">{rt.name}</h3>
                  <p className="text-sm text-gray-500">Sức chứa: {rt.capacity} khách</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-brand-600">{formatVND(Number(rt.price_per_night))}</div>
                  <div className="text-xs text-gray-400">/đêm</div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-gray-500">{rt.rooms.length} phòng vật lý</span>
                  {/* Số phòng trống realtime — cập nhật tự động sau khi đặt / admin đổi phòng */}
                  {freeCounts[rt.room_type_id] === 0 ? (
                    <Badge color="red">Hết phòng trong ngày đã chọn</Badge>
                  ) : freeCounts[rt.room_type_id] && freeCounts[rt.room_type_id] < 5 ? (
                    <Badge color="amber">Chỉ còn {freeCounts[rt.room_type_id]} phòng!</Badge>
                  ) : (
                    <Badge color="green">Còn {freeCounts[rt.room_type_id] ?? 0} phòng trống</Badge>
                  )}
                </div>
                <Button
                  onClick={() => book(rt.room_type_id)}
                  disabled={!freeCounts[rt.room_type_id]}
                >
                  Đặt ngay
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Đánh giá ({reviews?.length ?? 0})</h2>
          {user && (
            <Button variant="secondary" size="sm" onClick={() => setReviewOpen(true)}>Viết đánh giá</Button>
          )}
        </div>
        {reviews && reviews.length === 0 ? (
          <p className="text-gray-500">Chưa có đánh giá.</p>
        ) : (
          <div className="space-y-3">
            {reviews?.map((r) => (
              <div key={r.review_id} className="rounded-xl bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">{r.user.full_name}</span>
                  <StarRating value={r.rating} />
                </div>
                {r.comment && <p className="mt-2 text-sm text-gray-600">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      <ReviewModal hotelId={Number(id)} open={reviewOpen} onClose={() => setReviewOpen(false)} onDone={() => void refetch()} />
    </div>
  );
}

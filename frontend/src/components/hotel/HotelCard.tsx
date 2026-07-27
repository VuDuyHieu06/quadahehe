import { Link } from 'react-router-dom';
import type { HotelListItem } from '../../types';
import { formatVND } from '../../lib/format';
import { StarRating } from '../ui/StarRating';
import { Badge } from '../ui/Badge';
import { HotelImage } from './HotelImage';

const TYPE_LABEL: Record<string, string> = {
  HOTEL: 'Khách sạn',
  RESORT: 'Resort',
  VILLA: 'Biệt thự',
  APARTMENT: 'Căn hộ',
};

export function HotelCard({ hotel }: { hotel: HotelListItem }) {
  const lowStock = hotel.available_rooms > 0 && hotel.available_rooms < 5;
  return (
    <Link to={`/hotels/${hotel.hotel_id}`} className="group block overflow-hidden rounded-2xl bg-white shadow transition hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <HotelImage src={hotel.images[0]} alt={hotel.name} className="h-full w-full transition group-hover:scale-105" />
        <div className="absolute left-3 top-3">
          <Badge color="brand">{TYPE_LABEL[hotel.property_type]}</Badge>
        </div>
        {lowStock && (
          <div className="absolute right-3 top-3">
            <Badge color="amber">Chỉ còn {hotel.available_rooms} phòng!</Badge>
          </div>
        )}
        {hotel.available_rooms === 0 && (
          <div className="absolute right-3 top-3">
            <Badge color="red">Hết phòng</Badge>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-gray-900 line-clamp-1">{hotel.name}</h3>
          {hotel.star_rating > 0 && <StarRating value={hotel.star_rating} />}
        </div>
        <p className="mt-1 text-sm text-gray-500">📍 {hotel.city} — {hotel.address}</p>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {hotel.amenities.slice(0, 4).map((a) => (
            <Badge key={a.name} color="gray">{a.name}</Badge>
          ))}
        </div>

        <div className="mt-3 flex items-end justify-between">
          <div>
            {hotel.review_count > 0 ? (
              <div className="flex items-center gap-1">
                <StarRating value={hotel.avg_rating} showNumber />
                <span className="text-xs text-gray-400">({hotel.review_count})</span>
              </div>
            ) : (
              <span className="text-xs text-gray-400">Chưa có đánh giá</span>
            )}
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">từ</div>
            <div className="text-lg font-bold text-brand-600">{formatVND(hotel.min_price)}<span className="text-xs font-normal text-gray-400">/đêm</span></div>
          </div>
        </div>
      </div>
    </Link>
  );
}

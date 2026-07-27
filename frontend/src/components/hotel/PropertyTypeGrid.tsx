import { Link } from 'react-router-dom';
import { HotelImage } from './HotelImage';

const ITEMS = [
  { type: 'HOTEL', label: 'Khách sạn', seed: 100 },
  { type: 'RESORT', label: 'Resort', seed: 200 },
  { type: 'VILLA', label: 'Biệt thự', seed: 300 },
  { type: 'APARTMENT', label: 'Căn hộ', seed: 400 },
];

export function PropertyTypeGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <h2 className="mb-5 text-xl font-bold text-gray-900">Tìm theo loại chỗ nghỉ</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {ITEMS.map((it) => (
          <Link
            key={it.type}
            to={`/search?property_type=${it.type}`}
            className="group relative overflow-hidden rounded-2xl"
          >
            <HotelImage
              src={`https://picsum.photos/seed/stayhub${it.seed}/600/400`}
              alt={it.label}
              className="h-40 w-full transition group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-3 text-lg font-bold text-white">{it.label}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}

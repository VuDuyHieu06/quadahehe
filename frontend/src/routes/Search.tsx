import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { hotelApi, amenityApi } from '../api';
import { useFetch } from '../hooks/useFetch';
import { useBookingEvent } from '../hooks/useBookingEvents';
import { HotelCard } from '../components/hotel/HotelCard';
import { Filters, type FilterState } from '../components/filters/Filters';
import { Spinner } from '../components/ui/Spinner';

export function Search() {
  const [params] = useSearchParams();
  const city = params.get('city') ?? '';
  const checkIn = params.get('checkIn') ?? '';
  const checkOut = params.get('checkOut') ?? '';
  const guests = params.get('guests') ?? '2';
  const propertyType = params.get('property_type') ?? '';

  const amenitiesFetch = useFetch(() => amenityApi.list(), []);

  const [filters, setFilters] = useState<FilterState>({ amenities: [] });
  const [results, setResults] = useState<Awaited<ReturnType<typeof hotelApi.list>>>([]);
  const [loading, setLoading] = useState(true);
  // Tick để re-fetch khi có đặt phòng/admin đổi phòng -> cập nhật số phòng trống realtime.
  const [refreshKey, setRefreshKey] = useState(0);
  useBookingEvent(() => setRefreshKey((k) => k + 1));

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    const selectedAmenities = filters.amenities.join(',');
    hotelApi
      .list({
        city, property_type: propertyType, checkIn, checkOut, guests,
        minPrice: filters.minPrice, maxPrice: filters.maxPrice,
        minStars: filters.minStars,
        // chỉ gửi amenities khi thực sự có chọn -> tránh backend filter NaN rỗng
        amenities: selectedAmenities || undefined,
      })
      .then((r) => { if (!cancel) setResults(r); })
      .catch(() => { if (!cancel) setResults([]); })
      .finally(() => { if (!cancel) setLoading(false); });
    return () => { cancel = true; };
  }, [city, propertyType, checkIn, checkOut, guests, filters, refreshKey]);

  const header = useMemo(() => {
    return city ? `Kết quả tại "${city}"` : 'Tất cả chỗ nghỉ';
  }, [city]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-4 text-xl font-bold text-gray-900">{header}</h1>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside>
          {amenitiesFetch.data && (
            <Filters state={filters} onChange={setFilters} amenities={amenitiesFetch.data} />
          )}
        </aside>

        <section>
          {loading ? (
            <div className="flex justify-center py-20"><Spinner className="h-7 w-7" /></div>
          ) : results.length === 0 ? (
            <p className="py-20 text-center text-gray-500">Không tìm thấy chỗ nghỉ phù hợp.</p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((h) => <HotelCard key={h.hotel_id} hotel={h} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

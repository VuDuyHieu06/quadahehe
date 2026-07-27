import type { Amenity } from '../../types';
import { Input } from '../ui/Input';

export interface FilterState {
  minPrice?: number;
  maxPrice?: number;
  minStars?: number;
  amenities: number[];
}

interface FiltersProps {
  state: FilterState;
  onChange: (state: FilterState) => void;
  amenities: Amenity[];
}

export function Filters({ state, onChange, amenities }: FiltersProps) {
  const toggleAmenity = (id: number) => {
    const amenities = state.amenities.includes(id)
      ? state.amenities.filter((a) => a !== id)
      : [...state.amenities, id];
    onChange({ ...state, amenities });
  };

  return (
    <div className="space-y-6 rounded-2xl bg-white p-5 shadow-sm">
      <h3 className="font-bold text-gray-900">Bộ lọc</h3>

      <div>
        <p className="mb-2 text-sm font-semibold text-gray-700">Khoảng giá (₫/đêm)</p>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Từ"
            value={state.minPrice ?? ''}
            onChange={(e) => onChange({ ...state, minPrice: e.target.value ? Number(e.target.value) : undefined })}
          />
          <Input
            type="number"
            placeholder="Đến"
            value={state.maxPrice ?? ''}
            onChange={(e) => onChange({ ...state, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-gray-700">Sao đánh giá</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => onChange({ ...state, minStars: state.minStars === n ? undefined : n })}
              className={`h-9 w-9 rounded-lg border text-sm font-semibold ${
                state.minStars === n ? 'border-brand-500 bg-brand-100 text-brand-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {n}★
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-gray-700">Tiện ích</p>
        <div className="flex flex-wrap gap-2">
          {amenities.map((a) => {
            const active = state.amenities.includes(a.amenity_id);
            return (
              <button
                key={a.amenity_id}
                onClick={() => toggleAmenity(a.amenity_id)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  active ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {a.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

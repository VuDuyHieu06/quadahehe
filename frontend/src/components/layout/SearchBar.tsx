import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Label, Select } from '../ui/Input';

export interface SearchValues {
  city: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export function SearchBar({ compact = false }: { compact?: boolean }) {
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const [values, setValues] = useState<SearchValues>({ city: '', checkIn: today, checkOut: tomorrow, guests: 2 });
  const navigate = useNavigate();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const q = new URLSearchParams({
      city: values.city,
      checkIn: values.checkIn,
      checkOut: values.checkOut,
      guests: String(values.guests),
    });
    void navigate(`/search?${q.toString()}`);
  };

  return (
    <form onSubmit={submit} className={`rounded-2xl bg-white p-4 shadow-xl ${compact ? '' : 'grid grid-cols-1 gap-3 md:grid-cols-4'}`}>
      <div>
        <Label>Điểm đến</Label>
        <Input placeholder="VD: Đà Nẵng" value={values.city} onChange={(e) => setValues({ ...values, city: e.target.value })} />
      </div>
      <div>
        <Label>Ngày nhận phòng</Label>
        <Input type="date" min={today} value={values.checkIn} onChange={(e) => setValues({ ...values, checkIn: e.target.value })} />
      </div>
      <div>
        <Label>Ngày trả phòng</Label>
        <Input type="date" min={values.checkIn} value={values.checkOut} onChange={(e) => setValues({ ...values, checkOut: e.target.value })} />
      </div>
      <div>
        <Label>Số khách</Label>
        <Select value={values.guests} onChange={(e) => setValues({ ...values, guests: Number(e.target.value) })}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>{n} khách</option>
          ))}
        </Select>
      </div>
      {!compact && (
        <div className="md:col-span-4">
          <button type="submit" className="w-full rounded-lg bg-brand-600 py-3 text-sm font-bold text-white hover:bg-brand-700">
            🔍 Tìm chỗ nghỉ
          </button>
        </div>
      )}
      {compact && (
        <button type="submit" className="self-end rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-700">
          Tìm
        </button>
      )}
    </form>
  );
}

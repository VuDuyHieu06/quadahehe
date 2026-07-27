import { useFetch } from '../../hooks/useFetch';
import { useEffect, useState } from 'react';
import { adminApi, amenityApi, roomTypeApi } from '../../api';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input, Label, Select, Textarea } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import type { Amenity, HotelListItem, RoomType } from '../../types';

const PT = [{ v: 'HOTEL', l: 'Khách sạn' }, { v: 'RESORT', l: 'Resort' }, { v: 'VILLA', l: 'Biệt thự' }, { v: 'APARTMENT', l: 'Căn hộ' }];

export function AdminHotels() {
  const { data, loading, refetch } = useFetch(() => adminApi.listHotels(), []);
  const { data: amenities } = useFetch(() => amenityApi.list(), []);
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<HotelListItem | null>(null);
  const [form, setForm] = useState<any>({ name: '', property_type: 'HOTEL', city: '', address: '', description: '', star_rating: 3, amenity_ids: [] });

  const openCreate = () => { setEditing(null); setForm({ name: '', property_type: 'HOTEL', city: '', address: '', description: '', star_rating: 3, amenity_ids: [] }); setOpen(true); };
  const openEdit = (h: HotelListItem) => {
    setEditing(h);
    setForm({ name: h.name, property_type: h.property_type, city: h.city, address: h.address, description: h.description ?? '', star_rating: h.star_rating, amenity_ids: [] });
    setOpen(true);
  };

  const toggleAmen = (id: number) => setForm((f: any) => ({ ...f, amenity_ids: f.amenity_ids.includes(id) ? f.amenity_ids.filter((x: number) => x !== id) : [...f.amenity_ids, id] }));

  const save = async () => {
    try {
      if (editing) await adminApi.updateHotel(editing.hotel_id, form);
      else await adminApi.createHotel(form);
      toast.push('Đã lưu.', 'success');
      setOpen(false);
      void refetch();
    } catch (err) { toast.push(err instanceof Error ? err.message : 'Lỗi.', 'error'); }
  };

  const remove = async (id: number) => {
    if (!confirm('Xoá khách sạn này?')) return;
    try { await adminApi.deleteHotel(id); toast.push('Đã xoá.', 'success'); void refetch(); }
    catch (err) { toast.push(err instanceof Error ? err.message : 'Lỗi.', 'error'); }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner className="h-7 w-7" /></div>;

  return (
    <div>
      <div className="mb-4 flex justify-between"><h2 className="text-lg font-bold">Khách sạn</h2><Button size="sm" onClick={openCreate}>+ Thêm khách sạn</Button></div>
      <div className="space-y-3">
        {data?.map((h) => (
          <div key={h.hotel_id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white p-4 shadow-sm">
            <div>
              <div className="flex items-center gap-2"><span className="font-bold">{h.name}</span><Badge color="brand">{PT.find((p) => p.v === h.property_type)?.l}</Badge></div>
              <div className="text-sm text-gray-500">📍 {h.city}</div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => openEdit(h)}>Sửa</Button>
              <Button variant="danger" size="sm" onClick={() => remove(h.hotel_id)}>Xoá</Button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Sửa khách sạn' : 'Thêm khách sạn'}>
        <div className="space-y-3">
          <div><Label>Tên</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Loại</Label><Select value={form.property_type} onChange={(e) => setForm({ ...form, property_type: e.target.value })}>{PT.map((p) => <option key={p.v} value={p.v}>{p.l}</option>)}</Select></div>
            <div><Label>Sao</Label><Input type="number" min={0} max={5} value={form.star_rating} onChange={(e) => setForm({ ...form, star_rating: Number(e.target.value) })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Thành phố</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
            <div><Label>Địa chỉ</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
          </div>
          <div><Label>Mô tả</Label><Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div>
            <Label>Tiện ích</Label>
            <div className="flex flex-wrap gap-2">
              {amenities?.map((a: Amenity) => (
                <button key={a.amenity_id} type="button" onClick={() => toggleAmen(a.amenity_id)} className={`rounded-full px-3 py-1 text-xs ${form.amenity_ids.includes(a.amenity_id) ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700'}`}>{a.name}</button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Huỷ</Button>
            <Button onClick={() => void save()}>Lưu</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

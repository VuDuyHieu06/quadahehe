import { useFetch } from '../../hooks/useFetch';
import { useEffect, useState } from 'react';
import { adminApi, hotelApi, roomTypeApi } from '../../api';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Select, Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { notifyBookingChanged } from '../../hooks/useBookingEvents';
import type { Room, RoomStatus, HotelDetail, RoomType } from '../../types';

const STATUS_COLOR: Record<RoomStatus, any> = { available: 'green', maintenance: 'amber', booked: 'gray' };
const STATUS_LABEL: Record<RoomStatus, string> = { available: 'Trống', maintenance: 'Đang sửa', booked: 'Đã đặt' };

export function AdminRooms() {
  const { data: hotels } = useFetch(() => adminApi.listHotels(), []);
  const [hotelId, setHotelId] = useState<number | null>(null);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [newRoom, setNewRoom] = useState<{ room_type_id: string; room_number: string }>({ room_type_id: '', room_number: '' });

  // Lấy danh sách khách sạn đầu tiên khi load
  useEffect(() => {
    if (hotels && hotels.length && hotelId == null) setHotelId(hotels[0].hotel_id);
  }, [hotels]);

  // Lấy room types khi đổi hotel
  useEffect(() => {
    if (hotelId == null) return;
    (async () => {
      setLoading(true);
      try {
        const detail = await hotelApi.detail(hotelId);
        const types = (detail as any).roomTypes as RoomType[];
        setRoomTypes(types);
        setRooms([]);
        setNewRoom({ room_type_id: String(types[0]?.room_type_id ?? ''), room_number: '' });
      } finally { setLoading(false); }
    })();
  }, [hotelId]);

  const loadRooms = async (rtId: number) => {
    const r = await adminApi.roomsByType(rtId);
    setRooms(r);
  };

  const setStatus = async (roomId: number, status: RoomStatus) => {
    try { await adminApi.updateRoom(roomId, { status }); toast.push('Đã đổi trạng thái.', 'success'); notifyBookingChanged(); } catch (e) { toast.push(String(e), 'error'); }
  };

  const addRoom = async () => {
    if (!newRoom.room_type_id || !newRoom.room_number) { toast.push('Chọn loại phòng và nhập số phòng.', 'error'); return; }
    try {
      await adminApi.createRoom({ room_type_id: Number(newRoom.room_type_id), room_number: newRoom.room_number, status: 'available' });
      toast.push('Đã thêm phòng.', 'success'); notifyBookingChanged();
      setNewRoom({ ...newRoom, room_number: '' });
      void loadRooms(Number(newRoom.room_type_id));
    } catch (e) { toast.push(String(e), 'error'); }
  };

  const del = async (id: number) => {
    if (!confirm('Xoá phòng?')) return;
    try { await adminApi.deleteRoom(id); toast.push('Đã xoá.', 'success'); notifyBookingChanged(); if (newRoom.room_type_id) void loadRooms(Number(newRoom.room_type_id)); } catch (e) { toast.push(String(e), 'error'); }
  };

  if (loading && rooms.length === 0) return <div className="flex justify-center py-20"><Spinner className="h-7 w-7" /></div>;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-500">Khách sạn</label>
          <Select value={hotelId ?? ''} onChange={(e) => setHotelId(Number(e.target.value))} className="w-60">
            {hotels?.map((h) => <option key={h.hotel_id} value={h.hotel_id}>{h.name}</option>)}
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-500">Loại phòng</label>
          <Select onChange={(e) => void loadRooms(Number(e.target.value))} className="w-56">
            {roomTypes.map((rt) => <option key={rt.room_type_id} value={rt.room_type_id}>{rt.name}</option>)}
          </Select>
        </div>
      </div>

      <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
        <div className="mb-2 text-sm font-semibold text-gray-700">+ Thêm phòng vật lý</div>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <Select value={newRoom.room_type_id} onChange={(e) => setNewRoom({ ...newRoom, room_type_id: e.target.value })} className="w-56">
              {roomTypes.map((rt) => <option key={rt.room_type_id} value={rt.room_type_id}>{rt.name}</option>)}
            </Select>
          </div>
          <Input placeholder="Số phòng (VD: 101)" value={newRoom.room_number} onChange={(e) => setNewRoom({ ...newRoom, room_number: e.target.value })} className="w-40" />
          <Button size="sm" onClick={() => void addRoom()}>Thêm</Button>
        </div>
      </div>

      <h3 className="mb-2 font-semibold">Danh sách phòng</h3>
      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr><th className="p-3">ID</th><th className="p-3">Số phòng</th><th className="p-3">Trạng thái</th><th className="p-3">Hành động</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {rooms.map((r) => (
              <tr key={r.room_id} className="border-t border-gray-100">
                <td className="p-3">{r.room_id}</td>
                <td className="p-3 font-semibold">{r.room_number}</td>
                <td className="p-3"><Badge color={STATUS_COLOR[r.status]}>{STATUS_LABEL[r.status]}</Badge></td>
                <td className="p-3">
                  <Select defaultValue="" onChange={(e) => void setStatus(r.room_id, e.target.value as RoomStatus)} className="py-1.5 text-xs w-40">
                    <option value="">-- đổi trạng thái --</option>
                    <option value="available">Trống</option>
                    <option value="maintenance">Đang sửa</option>
                    <option value="booked">Đã đặt</option>
                  </Select>
                </td>
                <td className="p-3"><Button variant="ghost" size="sm" onClick={() => void del(r.room_id)}>Xoá</Button></td>
              </tr>
            ))}
            {rooms.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-gray-500">Chọn loại phòng để xem/xoá.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { api, unwrap } from './client';
import type {
  Amenity, AuthResponse, HotelDetail, HotelListItem, Room, RoomType, Booking,
} from '../types';

// Auth
export const authApi = {
  register: (b: { full_name: string; email: string; password: string; phone?: string }) =>
    api.post('/auth/register', b).then((r) => unwrap<AuthResponse>(r as any)),
  login: (b: { email: string; password: string }) =>
    api.post('/auth/login', b).then((r) => unwrap<AuthResponse>(r as any)),
  me: () => api.get('/auth/me').then((r) => unwrap<AuthResponse['user']>(r as any)),
};

// Hotels
export const hotelApi = {
  list: (params: Record<string, unknown>) =>
    api.get('/hotels', { params }).then((r) => unwrap<HotelListItem[]>(r as any)),
  detail: (id: number) => api.get(`/hotels/${id}`).then((r) => unwrap<HotelDetail>(r as any)),
};

// Amenities
export const amenityApi = {
  list: () => api.get('/amenities').then((r) => unwrap<Amenity[]>(r as any)),
};

// Rooms
export const roomApi = {
  available: (roomTypeId: number, checkIn: string, checkOut: string) =>
    api.get(`/rooms/${roomTypeId}/available`, { params: { checkIn, checkOut } })
      .then((r) => unwrap<{ room_id: number; room_number: string; room_type_id: number; price_per_night: number }[]>(r as any)),
  byType: (roomTypeId: number) =>
    api.get('/rooms', { params: { roomTypeId } }).then((r) => unwrap<Room[]>(r as any)),
};

export const roomTypeApi = {
  create: (b: { hotel_id: number; name: string; capacity: number; price_per_night: number }) =>
    api.post('/room-types', b).then((r) => unwrap<RoomType>(r as any)),
};

export const bookingApi = {
  create: (b: { room_type_id: number; room_id: number; check_in_date: string; check_out_date: string }) =>
    api.post('/bookings', b).then((r) => unwrap<Booking>(r as any)),
  my: () => api.get('/bookings/my').then((r) => unwrap<Booking[]>(r as any)),
  all: () => api.get('/bookings').then((r) => unwrap<Booking[]>(r as any)),
  updateStatus: (id: number, status: string) =>
    api.patch(`/bookings/${id}/status`, { status }).then((r) => unwrap<Booking>(r as any)),
};

export const reviewApi = {
  list: (hotelId: number) =>
    api.get(`/hotels/${hotelId}/reviews`)
      .then((r) => unwrap<{ review_id: number; rating: number; comment: string | null; user: { full_name: string } }[]>(r as any)),
  create: (hotelId: number, b: { rating: number; comment?: string }) =>
    api.post(`/hotels/${hotelId}/reviews`, b).then((r) => unwrap<any>(r as any)),
};

export const adminApi = {
  listHotels: () => api.get('/hotels').then((r) => unwrap<HotelListItem[]>(r as any)),
  createHotel: (b: any) => api.post('/hotels', b).then((r) => unwrap<any>(r as any)),
  updateHotel: (id: number, b: any) => api.put(`/hotels/${id}`, b).then((r) => unwrap<any>(r as any)),
  deleteHotel: (id: number) => api.delete(`/hotels/${id}`).then((r) => unwrap<any>(r as any)),
  roomsByType: (roomTypeId: number) =>
    api.get('/rooms', { params: { roomTypeId } }).then((r) => unwrap<Room[]>(r as any)),
  createRoom: (b: { room_type_id: number; room_number: string; status: Room['status'] }) =>
    api.post('/rooms', b).then((r) => unwrap<any>(r as any)),
  updateRoom: (id: number, b: { status?: Room['status']; room_number?: string }) =>
    api.patch(`/rooms/${id}`, b).then((r) => unwrap<any>(r as any)),
  deleteRoom: (id: number) => api.delete(`/rooms/${id}`).then((r) => unwrap<any>(r as any)),
};

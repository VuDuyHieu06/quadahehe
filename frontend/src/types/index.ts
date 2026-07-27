export type Role = 'CUSTOMER' | 'ADMIN';
export type PropertyType = 'HOTEL' | 'RESORT' | 'VILLA' | 'APARTMENT';
export type RoomStatus = 'available' | 'maintenance' | 'booked';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface User {
  user_id: number;
  full_name: string;
  email: string;
  role: Role;
  phone?: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface HotelListItem {
  hotel_id: number;
  name: string;
  property_type: PropertyType;
  city: string;
  address: string;
  description: string | null;
  star_rating: number;
  images: string[];
  amenities: { name: string }[];
  min_price: number | null;
  available_rooms: number;
  avg_rating: number;
  review_count: number;
}

export interface RoomType {
  room_type_id: number;
  hotel_id: number;
  name: string;
  capacity: number;
  price_per_night: number;
  rooms: Room[];
  hotel?: { name: string; hotel_id: number };
}

export interface Room {
  room_id: number;
  room_type_id: number;
  room_number: string;
  status: RoomStatus;
}

export interface Amenity {
  amenity_id: number;
  name: string;
}

export interface HotelDetail extends Omit<HotelListItem, 'available_rooms' | 'amenities' | 'min_price'> {
  amenities: { amenity: Amenity }[];
  roomTypes: RoomType[];
  reviews: {
    review_id: number;
    rating: number;
    comment: string | null;
    user: { full_name: string };
  }[];
}

export interface Booking {
  booking_id: number;
  user_id: number;
  room_id: number;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
  status: BookingStatus;
  createdAt: string;
  room?: Room & { roomType?: RoomType };
  user?: { full_name: string; email: string };
}

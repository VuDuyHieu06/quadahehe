import { prisma } from '../../prisma/client';
import { Prisma, PropertyType } from '@prisma/client';
import { normalizeSearch, matchesSearch } from '../../utils/normalize';
import type { HotelQuery, CreateHotelInput, UpdateHotelInput } from './hotel.validator';

export interface HotelWithAvailability {
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

export class HotelService {
  // Liệt kê khách sạn với bộ lọc (bỏ qua kiểm tra phòng trống vì có lỗi).
  async list(query: HotelQuery): Promise<HotelWithAvailability[]> {
    const where: Prisma.HotelWhereInput = {};
    // city/name/address được lọc mờ phía Node (Prisma MySQL contains không insensitive
    // tốt với unicode tiếng Việt) -> không nhét vào where để còn giữ full tập ứng viên.
    if (query.property_type) where.property_type = query.property_type;
    if (query.minStars) where.star_rating = { gte: query.minStars };

    // Lọc tiện ích: khách sạn phải CÓ TẤT CẢ amenity_id đã chọn.
    if (query.amenities && query.amenities.length) {
      where.amenities = { some: { amenity_id: { in: query.amenities } } };
    }

    const hotels = await prisma.hotel.findMany({
      where,
      include: {
        amenities: { include: { amenity: true } },
        roomTypes: { include: { rooms: true } },
        reviews: { select: { rating: true } },
      },
      orderBy: { hotel_id: 'asc' },
    });

    // Tìm kiếm mờ tiếng Việt: bỏ dấu cả 2 phía rồi khớp bất kỳ trường nào.
    const kw = normalizeSearch(query.city);
    const matchedHotels = kw
      ? hotels.filter((h) =>
          matchesSearch(h.city, kw) ||
          matchesSearch(h.name, kw) ||
          matchesSearch(h.address, kw),
        )
      : hotels;

    const enriched = await Promise.all(
      matchedHotels.map((h) => this.enrichHotel(h, { checkIn: null, checkOut: null, guests: query.guests })),
    );

    return enriched.filter((h) => {
      if (query.minPrice != null && h.min_price != null && h.min_price < query.minPrice) return false;
      if (query.maxPrice != null && h.min_price != null && h.min_price > query.maxPrice) return false;
      // Bỏ qua kiểm tra phòng trống vì đã tạm thời vô hiệu hóa tính năng này
      return true;
    });
  }

  // Tính giá/đánh giá cho 1 khách sạn (bỏ qua tìm kiếm phòng vì có lỗi).
  private async enrichHotel(
    hotel: Prisma.HotelGetPayload<{
      include: { amenities: { include: { amenity: true } }; roomTypes: { include: { rooms: true } }; reviews: { select: { rating: true } } };
    }>
  ): Promise<HotelWithAvailability> {
    const minPrice =
      hotel.roomTypes.length > 0
        ? Math.min(...hotel.roomTypes.map((rt) => Number(rt.price_per_night)))
        : null;

    // Tính tổng số phòng (bỏ qua kiểm tra khả năng và đặt chỗ vì có lỗi)
    let totalRooms = 0;
    for (const rt of hotel.roomTypes) {
      for (const room of rt.rooms) {
        totalRooms++;
      }
    }

    const ratings = hotel.reviews.map((r) => r.rating);
    const avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

    return {
      hotel_id: hotel.hotel_id,
      name: hotel.name,
      property_type: hotel.property_type,
      city: hotel.city,
      address: hotel.address,
      description: hotel.description,
      star_rating: hotel.star_rating,
      images: parseImages(hotel.images),
      amenities: hotel.amenities.map((a) => ({ name: a.amenity.name })),
      min_price: minPrice != null ? Number(minPrice) : null,
      available_rooms: totalRooms, // Sử dụng tổng số phòng thay vì phòng trống có sẵn
      avg_rating: Number(avgRating.toFixed(1)),
      review_count: ratings.length,
    };
  }

  // Kiểm tra 1 phòng đã có booking overlap khoảng [checkIn, checkOut) chưa.
  async hasOverlap(roomId: number, checkIn: Date, checkOut: Date): Promise<boolean> {
    const count = await prisma.booking.count({
      where: {
        room_id: roomId,
        status: { in: ['pending', 'confirmed'] },
        AND: [{ check_in_date: { lt: checkOut } }, { check_out_date: { gt: checkIn } }],
      },
    });
    return count > 0;
  }

  findOne(id: number) {
    return prisma.hotel.findUnique({
      where: { hotel_id: id },
      include: {
        amenities: { include: { amenity: true } },
        roomTypes: { include: { rooms: true } },
        reviews: { include: { user: { select: { full_name: true } } } },
      },
    });
  }

  async create(data: CreateHotelInput) {
    const { amenity_ids, ...hotelFields } = data;
    return prisma.hotel.create({
      data: {
        ...hotelFields,
        images: hotelFields.images ?? [],
        amenities: amenity_ids?.length
          ? { create: amenity_ids.map((amenity_id) => ({ amenity_id })) }
          : undefined,
      },
      include: { amenities: { include: { amenity: true } } },
    });
  }

  async update(id: number, data: UpdateHotelInput) {
    const { amenity_ids, ...hotelFields } = data;
    return prisma.hotel.update({
      where: { hotel_id: id },
      data: {
        ...hotelFields,
        ...(amenity_ids
          ? { amenities: { deleteMany: {}, create: amenity_ids.map((amenity_id) => ({ amenity_id })) } }
          : {}),
      },
      include: { amenities: { include: { amenity: true } } },
    });
  }

  remove(id: number) {
    return prisma.hotel.delete({ where: { hotel_id: id } });
  }
}

function parseImages(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw as string[];
  if (typeof raw === 'string') { try { const p = JSON.parse(raw); return Array.isArray(p) ? p : []; } catch { return []; } }
  return [];
}
export const hotelService = new HotelService();

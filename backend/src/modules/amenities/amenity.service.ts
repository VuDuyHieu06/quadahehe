import { prisma } from '../../prisma/client';
import { Prisma } from '@prisma/client';

export class AmenityService {
  list() {
    return prisma.amenity.findMany({ orderBy: { amenity_id: 'asc' } });
  }

  async create(name: string) {
    try {
      return await prisma.amenity.create({ data: { name } });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new Error('Tên tiện ích đã tồn tại.');
      }
      throw err;
    }
  }

  remove(id: number) {
    return prisma.amenity.delete({ where: { amenity_id: id } });
  }

  // Gán/bỏ tiện ích cho khách sạn
  async attachAmenities(hotelId: number, amenityIds: number[]) {
    await prisma.hotelAmenity.deleteMany({ where: { hotel_id: hotelId } });
    if (amenityIds.length === 0) return [];
    return prisma.hotelAmenity.createMany({
      data: amenityIds.map((amenity_id) => ({ hotel_id: hotelId, amenity_id })),
    });
  }
}

export const amenityService = new AmenityService();

import { prisma } from '../../prisma/client';
import type { z } from 'zod';
import type { createRoomTypeSchema, updateRoomTypeSchema } from './roomType.validator';

export class RoomTypeService {
  async listByHotel(hotelId: number) {
    return prisma.roomType.findMany({
      where: { hotel_id: hotelId },
      include: { rooms: true, hotel: { select: { name: true } } },
      orderBy: { price_per_night: 'asc' },
    });
  }

  create(data: z.infer<typeof createRoomTypeSchema>) {
    return prisma.roomType.create({ data });
  }

  update(id: number, data: z.infer<typeof updateRoomTypeSchema>) {
    return prisma.roomType.update({ where: { room_type_id: id }, data });
  }

  remove(id: number) {
    return prisma.roomType.delete({ where: { room_type_id: id } });
  }
}

export const roomTypeService = new RoomTypeService();

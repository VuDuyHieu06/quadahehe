import { prisma } from '../../prisma/client';
import { Prisma } from '@prisma/client';
import { hotelService } from '../hotels/hotel.service';
import type { z } from 'zod';
import type { createRoomSchema, updateRoomSchema, roomAvailabilityQuerySchema } from './room.validator';

export class RoomService {
  async listByRoomType(roomTypeId: number) {
    return prisma.room.findMany({
      where: { room_type_id: roomTypeId },
      orderBy: { room_number: 'asc' },
    });
  }

  // Phòng còn trống cho dạng phòng trong khoảng ngày (chống overbooking).
  async availableRooms(roomTypeId: number, checkIn: Date, checkOut: Date) {
    const roomType = await prisma.roomType.findUnique({
      where: { room_type_id: roomTypeId },
    });

    if (!roomType) {
      throw new Error('Không tìm thấy loại phòng.');
    }

    const rooms = await prisma.room.findMany({
      where: { room_type_id: roomTypeId, status: 'available' },
      orderBy: { room_number: 'asc' },
    });

    const free: { room_id: number; room_number: string; room_type_id: number; price_per_night: number }[] = [];
    for (const room of rooms) {
      const overlap = await hotelService.hasOverlap(room.room_id, checkIn, checkOut);
      if (!overlap) {
        free.push({
          room_id: room.room_id,
          room_number: room.room_number,
          room_type_id: room.room_type_id,
          price_per_night: Number(roomType.price_per_night),
        });
      }
    }
    return free;
  }

  async create(data: z.infer<typeof createRoomSchema>) {
    try {
      return await prisma.room.create({ data });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new Error('Số phòng đã tồn tại cho dạng phòng này.');
      }
      throw err;
    }
  }

  async update(id: number, data: z.infer<typeof updateRoomSchema>) {
    return prisma.room.update({ where: { room_id: id }, data });
  }

  async remove(id: number) {
    return prisma.room.delete({ where: { room_id: id } });
  }
}

export const roomService = new RoomService();

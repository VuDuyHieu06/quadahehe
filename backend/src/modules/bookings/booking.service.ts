import { prisma } from '../../prisma/client';
import { type BookingStatus } from '@prisma/client';
import type { z } from 'zod';
import type { createBookingSchema, updateBookingStatusSchema } from './booking.validator';

export class BookingService {
  // TẠO BOOKING TRONG TRANSACTION — chống overbooking.
  // chọn phòng -> kiểm overlap -> update room.status=booked -> tạo booking.
  async create(input: z.infer<typeof createBookingSchema>, userId: number) {
    const checkIn = new Date(input.check_in_date);
    const checkOut = new Date(input.check_out_date);
    if (checkOut <= checkIn) throw new Error('Ngày trả phòng phải sau ngày nhận phòng.');

    return prisma.$transaction(async (tx) => {
      const room = await tx.room.findUnique({
        where: { room_id: input.room_id },
        include: { roomType: true },
      });
      if (!room) throw new Error('Không tìm thấy phòng.');
      if (room.roomType.room_type_id !== input.room_type_id) {
        throw new Error('Phòng không thuộc dạng phòng đã chọn.');
      }
      if (room.status === 'maintenance') throw new Error('Phòng đang bảo trì.');
      // Kiểm overlap với booking đang pending/confirmed
      const overlap = await tx.booking.findFirst({
        where: {
          room_id: room.room_id,
          status: { in: ['pending', 'confirmed'] },
          AND: [{ check_in_date: { lt: checkOut } }, { check_out_date: { gt: checkIn } }],
        },
      });
      if (overlap) throw new Error('Phòng đã được đặt trong khoảng ngày này.');

      // Tính tổng: số đêm * giá/đêm
      const nights = Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000));
      const total = Number(room.roomType.price_per_night) * nights;

      const booking = await tx.booking.create({
        data: {
          user_id: userId,
          room_id: room.room_id,
          check_in_date: checkIn,
          check_out_date: checkOut,
          total_price: total,
          status: 'pending',
        },
        include: { room: { include: { roomType: { include: { hotel: { select: { name: true } } } } } } },
      });

      // Chuyển trạng thái phòng -> booked (theo yêu cầu Admin có thể phụ)
      await tx.room.update({ where: { room_id: room.room_id }, data: { status: 'booked' } });
      return booking;
    });
  }

  myBookings(userId: number) {
    return prisma.booking.findMany({
      where: { user_id: userId },
      include: { room: { include: { roomType: { include: { hotel: { select: { name: true, hotel_id: true } } } } } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  all() {
    return prisma.booking.findMany({
      include: {
        user: { select: { full_name: true, email: true } },
        room: { include: { roomType: { include: { hotel: { select: { name: true } } } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: number, status: BookingStatus | z.infer<typeof updateBookingStatusSchema>['status']) {
    // Khi huỷ/hoàn thành -> trả phòng về available (nếu đang booked)
    const booking = await prisma.booking.findUnique({ where: { booking_id: id }, include: { room: true } });
    if (!booking) throw new Error('Không tìm thấy đơn đặt.');

    const updated = await prisma.booking.update({ where: { booking_id: id }, data: { status } });

    if ((status === 'cancelled' || status === 'completed') && booking.room.status === 'booked') {
      await prisma.room.update({ where: { room_id: booking.room_id }, data: { status: 'available' } });
    }
    return updated;
  }
}

export const bookingService = new BookingService();

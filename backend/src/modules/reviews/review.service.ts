import { prisma } from '../../prisma/client';

export class ReviewService {
  listByHotel(hotelId: number) {
    return prisma.review.findMany({
      where: { hotel_id: hotelId },
      include: { user: { select: { full_name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Chỉ user ĐÃ CÓ booking COMPLETED tại khách sạn này mới được review.
  async create(hotelId: number, userId: number, rating: number, comment?: string) {
    const hadStay = await prisma.booking.findFirst({
      where: { user_id: userId, status: 'completed', room: { roomType: { hotel_id: hotelId } } },
    });
    if (!hadStay) throw new Error('Bạn chỉ có thể đánh giá sau khi đã hoàn thành kỳ lưu trú tại khách sạn này.');

    return prisma.review.upsert({
      where: { hotel_id_user_id: { hotel_id: hotelId, user_id: userId } },
      update: { rating, comment },
      create: { hotel_id: hotelId, user_id: userId, rating, comment },
      include: { user: { select: { full_name: true } } },
    });
  }
}

export const reviewService = new ReviewService();

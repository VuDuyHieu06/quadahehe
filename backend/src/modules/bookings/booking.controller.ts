import { asyncHandler } from '../../utils/asyncHandler';
import { ok, fail } from '../../utils/api';
import { bookingService } from './booking.service';

export class BookingController {
  create = asyncHandler(async (req, res) => {
    try {
      const booking = await bookingService.create(req.body, req.user!.userId);
      return ok(res, booking, 201);
    } catch (err) {
      return fail(res, err instanceof Error ? err.message : 'Đặt phòng thất bại.');
    }
  });

  my = asyncHandler(async (req, res) => ok(res, await bookingService.myBookings(req.user!.userId)));

  all = asyncHandler(async (_req, res) => ok(res, await bookingService.all()));

  updateStatus = asyncHandler(async (req, res) => {
    try {
      return ok(res, await bookingService.updateStatus(Number(req.params.id), req.body.status));
    } catch (err) {
      return fail(res, err instanceof Error ? err.message : 'Không tìm thấy đơn.', 404);
    }
  });
}

export const bookingController = new BookingController();

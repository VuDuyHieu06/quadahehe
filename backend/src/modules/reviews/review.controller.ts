import { asyncHandler } from '../../utils/asyncHandler';
import { ok, fail } from '../../utils/api';
import { reviewService } from './review.service';

export class ReviewController {
  listByHotel = asyncHandler(async (req, res) => {
    return ok(res, await reviewService.listByHotel(Number(req.params.hotelId)));
  });

  create = asyncHandler(async (req, res) => {
    try {
      const review = await reviewService.create(
        Number(req.params.hotelId),
        req.user!.userId,
        req.body.rating,
        req.body.comment,
      );
      return ok(res, review, 201);
    } catch (err) {
      return fail(res, err instanceof Error ? err.message : 'Tạo đánh giá thất bại.', 403);
    }
  });
}

export const reviewController = new ReviewController();

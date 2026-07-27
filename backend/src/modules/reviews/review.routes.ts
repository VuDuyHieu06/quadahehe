import { Router } from 'express';
import { reviewController } from './review.controller';
import { authRequired } from '../../middlewares/auth';
import { validate } from '../../middlewares/validate';
import { createReviewSchema } from './review.validator';

// Router con này mount TẠI /hotels, nên đường dẫn thực là /api/hotels/:hotelId/reviews
export const reviewSubRoutes = Router();

reviewSubRoutes.get('/:hotelId/reviews', reviewController.listByHotel);
reviewSubRoutes.post('/:hotelId/reviews', authRequired, validate(createReviewSchema), reviewController.create);

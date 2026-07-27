import { Router } from 'express';
import { bookingController } from './booking.controller';
import { authRequired } from '../../middlewares/auth';
import { adminOnly } from '../../middlewares/role';
import { validate } from '../../middlewares/validate';
import { createBookingSchema, updateBookingStatusSchema } from './booking.validator';

export const bookingRoutes = Router();

bookingRoutes.post('/', authRequired, validate(createBookingSchema), bookingController.create);
bookingRoutes.get('/my', authRequired, bookingController.my);
bookingRoutes.get('/', authRequired, adminOnly, bookingController.all);
bookingRoutes.patch('/:id/status', authRequired, adminOnly, validate(updateBookingStatusSchema), bookingController.updateStatus);

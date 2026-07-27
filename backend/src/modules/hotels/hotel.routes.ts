import { Router } from 'express';
import { hotelController } from './hotel.controller';
import { authRequired } from '../../middlewares/auth';
import { adminOnly } from '../../middlewares/role';
import { validate } from '../../middlewares/validate';
import { createHotelSchema, updateHotelSchema, hotelQuerySchema } from './hotel.validator';
import { mountHotelRoomTypes } from '../roomTypes/roomType.routes';
import { reviewSubRoutes } from '../reviews/review.routes';

export const hotelRoutes = Router();

// Customer: danh sách + chi tiết
hotelRoutes.get('/', validate(hotelQuerySchema, 'query'), hotelController.list);
hotelRoutes.get('/:id', hotelController.detail);

// Endpoint reviews + room-types theo hotel
mountHotelRoomTypes(hotelRoutes); // /hotels/:hotelId/room-types
hotelRoutes.use(reviewSubRoutes); // /hotels/:hotelId/reviews

// Admin: CRUD
hotelRoutes.post('/', authRequired, adminOnly, validate(createHotelSchema), hotelController.create);
hotelRoutes.put('/:id', authRequired, adminOnly, validate(updateHotelSchema), hotelController.update);
hotelRoutes.delete('/:id', authRequired, adminOnly, hotelController.remove);

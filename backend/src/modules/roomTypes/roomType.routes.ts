import { Router } from 'express';
import { roomTypeController } from './roomType.controller';
import { authRequired } from '../../middlewares/auth';
import { adminOnly } from '../../middlewares/role';
import { validate } from '../../middlewares/validate';
import { createRoomTypeSchema, updateRoomTypeSchema } from './roomType.validator';

export const roomTypeRoutes = Router();

roomTypeRoutes.get('/', roomTypeController.listByHotel); // ?hotelId=
roomTypeRoutes.post('/', authRequired, adminOnly, validate(createRoomTypeSchema), roomTypeController.create);
roomTypeRoutes.put('/:id', authRequired, adminOnly, validate(updateRoomTypeSchema), roomTypeController.update);
roomTypeRoutes.delete('/:id', authRequired, adminOnly, roomTypeController.remove);

// Endpoint gắn hotel: /api/hotels/:hotelId/room-types
export function mountHotelRoomTypes(parent: Router) {
  parent.get('/:hotelId/room-types', roomTypeController.listByHotel);
}

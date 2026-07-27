import { Router } from 'express';
import { roomController } from './room.controller';
import { authRequired } from '../../middlewares/auth';
import { adminOnly } from '../../middlewares/role';
import { validate } from '../../middlewares/validate';
import { createRoomSchema, updateRoomSchema } from './room.validator';

export const roomRoutes = Router();

// Lấy danh sách phòng theo room_type (admin) và phòng trống (customer)
roomRoutes.get('/', authRequired, adminOnly, roomController.listByRoomType); // ?roomTypeId=
roomRoutes.get('/:roomTypeId/available', authRequired, roomController.available);
roomRoutes.post('/', authRequired, adminOnly, validate(createRoomSchema), roomController.create);
roomRoutes.patch('/:id', authRequired, adminOnly, validate(updateRoomSchema), roomController.update);
roomRoutes.delete('/:id', authRequired, adminOnly, roomController.remove);

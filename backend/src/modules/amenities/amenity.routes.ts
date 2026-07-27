import { Router } from 'express';
import { amenityController } from './amenity.controller';
import { adminOnly } from '../../middlewares/role';
import { validate } from '../../middlewares/validate';
import { createAmenitySchema } from './amenity.validator';

export const amenityRoutes = Router();

amenityRoutes.get('/', amenityController.list);
amenityRoutes.post('/', adminOnly, validate(createAmenitySchema), amenityController.create);
amenityRoutes.delete('/:id', adminOnly, amenityController.remove);

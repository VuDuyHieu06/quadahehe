import { asyncHandler } from '../../utils/asyncHandler';
import { ok, fail } from '../../utils/api';
import { amenityService } from './amenity.service';

export class AmenityController {
  list = asyncHandler(async (_req, res) => ok(res, await amenityService.list()));

  create = asyncHandler(async (req, res) => {
    try {
      const amenity = await amenityService.create(req.body.name);
      return ok(res, amenity, 201);
    } catch (err) {
      return fail(res, err instanceof Error ? err.message : 'Tạo tiện ích thất bại.');
    }
  });

  remove = asyncHandler(async (req, res) => {
    await amenityService.remove(Number(req.params.id));
    return ok(res, { deleted: true });
  });
}

export const amenityController = new AmenityController();

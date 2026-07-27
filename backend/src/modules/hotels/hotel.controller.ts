import { asyncHandler } from '../../utils/asyncHandler';
import { ok, fail } from '../../utils/api';
import { hotelService } from './hotel.service';

export class HotelController {
  list = asyncHandler(async (req, res) => {
    const hotels = await hotelService.list(req.query as any);
    return ok(res, hotels);
  });

  detail = asyncHandler(async (req, res) => {
    const hotel = await hotelService.findOne(Number(req.params.id));
    if (!hotel) return fail(res, 'Không tìm thấy khách sạn.', 404);
    return ok(res, hotel);
  });

  create = asyncHandler(async (req, res) => ok(res, await hotelService.create(req.body), 201));

  update = asyncHandler(async (req, res) => {
    try {
      return ok(res, await hotelService.update(Number(req.params.id), req.body));
    } catch {
      return fail(res, 'Không tìm thấy khách sạn để cập nhật.', 404);
    }
  });

  remove = asyncHandler(async (req, res) => {
    await hotelService.remove(Number(req.params.id));
    return ok(res, { deleted: true });
  });
}

export const hotelController = new HotelController();

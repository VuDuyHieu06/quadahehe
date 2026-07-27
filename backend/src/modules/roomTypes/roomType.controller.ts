import { asyncHandler } from '../../utils/asyncHandler';
import { ok, fail } from '../../utils/api';
import { roomTypeService } from './roomType.service';

export class RoomTypeController {
  listByHotel = asyncHandler(async (req, res) => {
    const hotelId = Number(req.params.hotelId);
    // Phân biệt: /api/hotels/:id/room-types hoặc /api/room-types?hotelId=
    const id = hotelId || Number(req.query.hotelId);
    return ok(res, await roomTypeService.listByHotel(id));
  });

  create = asyncHandler(async (req, res) => ok(res, await roomTypeService.create(req.body), 201));

  update = asyncHandler(async (req, res) => {
    try {
      return ok(res, await roomTypeService.update(Number(req.params.id), req.body));
    } catch {
      return fail(res, 'Không tìm thấy loại phòng.', 404);
    }
  });

  remove = asyncHandler(async (req, res) => {
    await roomTypeService.remove(Number(req.params.id));
    return ok(res, { deleted: true });
  });
}

export const roomTypeController = new RoomTypeController();

import { asyncHandler } from '../../utils/asyncHandler';
import { ok, fail } from '../../utils/api';
import { roomService } from './room.service';

export class RoomController {
  listByRoomType = asyncHandler(async (req, res) => {
    const roomTypeId = Number(req.params.roomTypeId) || Number(req.query.roomTypeId);
    return ok(res, await roomService.listByRoomType(roomTypeId));
  });

  available = asyncHandler(async (req, res) => {
    const roomTypeId = Number(req.params.roomTypeId);
    const { checkIn, checkOut } = req.query as any;
    if (!checkIn || !checkOut) return fail(res, 'Cần checkIn và checkOut.');
    const rooms = await roomService.availableRooms(roomTypeId, new Date(checkIn), new Date(checkOut));
    return ok(res, rooms);
  });

  create = asyncHandler(async (req, res) => {
    try {
      return ok(res, await roomService.create(req.body), 201);
    } catch (err) {
      return fail(res, err instanceof Error ? err.message : 'Tạo phòng thất bại.');
    }
  });

  update = asyncHandler(async (req, res) => {
    try {
      return ok(res, await roomService.update(Number(req.params.id), req.body));
    } catch {
      return fail(res, 'Không tìm thấy phòng.', 404);
    }
  });

  remove = asyncHandler(async (req, res) => {
    await roomService.remove(Number(req.params.id));
    return ok(res, { deleted: true });
  });
}

export const roomController = new RoomController();

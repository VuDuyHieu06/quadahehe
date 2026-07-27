import { z } from 'zod';

export const createRoomTypeSchema = z.object({
  hotel_id: z.number().int(),
  name: z.string().min(1),
  capacity: z.number().int().min(1).default(2),
  price_per_night: z.number().positive(),
});

export const updateRoomTypeSchema = createRoomTypeSchema.partial();

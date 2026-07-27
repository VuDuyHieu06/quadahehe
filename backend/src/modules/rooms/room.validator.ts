import { z } from 'zod';

export const createRoomSchema = z.object({
  room_type_id: z.number().int(),
  room_number: z.string().min(1),
  status: z.enum(['available', 'maintenance', 'booked']).default('available'),
});

export const updateRoomSchema = z.object({
  room_number: z.string().min(1).optional(),
  status: z.enum(['available', 'maintenance', 'booked']).optional(),
});

export const roomAvailabilityQuerySchema = z.object({
  checkIn: z.string(),  // ISO
  checkOut: z.string(), // ISO
});

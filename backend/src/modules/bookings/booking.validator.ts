import { z } from 'zod';

export const createBookingSchema = z.object({
  room_type_id: z.number().int(),
  room_id: z.number().int(),
  check_in_date: z.string(),  // ISO
  check_out_date: z.string(),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
});

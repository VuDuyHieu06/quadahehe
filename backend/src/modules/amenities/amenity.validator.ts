import { z } from 'zod';

export const createAmenitySchema = z.object({
  name: z.string().min(2, 'Tên tiện ích ít nhất 2 ký tự.'),
});

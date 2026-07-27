import { z } from 'zod';

export const propertyTypeValues = ['HOTEL', 'RESORT', 'VILLA', 'APARTMENT'] as const;

export const createHotelSchema = z.object({
  name: z.string().min(2),
  property_type: z.enum(propertyTypeValues),
  city: z.string().min(1),
  address: z.string().min(1),
  description: z.string().optional(),
  star_rating: z.number().int().min(0).max(5).default(0),
  images: z.array(z.string().url()).optional(),
  amenity_ids: z.array(z.number().int()).optional(),
});

export const updateHotelSchema = createHotelSchema.partial();

export type CreateHotelInput = z.infer<typeof createHotelSchema>;
export type UpdateHotelInput = z.infer<typeof updateHotelSchema>;

export const hotelQuerySchema = z.object({
  city: z.string().optional(),
  property_type: z.enum(propertyTypeValues).optional(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  guests: z.coerce.number().int().min(1).optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minStars: z.coerce.number().int().min(0).max(5).optional(),
  amenities: z
    .union([z.string(), z.array(z.coerce.number().int())])
    .optional()
    .transform((v) => {
      if (v == null) return undefined;
      const arr = Array.isArray(v) ? v : String(v).split(',').map(Number);
      // Lọc NaN/0/xuất hiện khi gửi chuỗi rỗng '' (Number('')=0) -> tránh filter IN (0)
      const clean = arr.filter((n) => Number.isFinite(n) && n > 0);
      return clean.length ? clean : undefined;
    }),
});

export type HotelQuery = z.infer<typeof hotelQuerySchema>;

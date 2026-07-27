import { z } from 'zod';

export const registerSchema = z.object({
  full_name: z.string().min(2, 'Họ tên ít nhất 2 ký tự.'),
  email: z.string().email('Email không hợp lệ.'),
  password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự.'),
  phone: z.string().optional(),
  role: z.enum(['CUSTOMER', 'ADMIN']).default('CUSTOMER'),
});

export const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ.'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu.'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

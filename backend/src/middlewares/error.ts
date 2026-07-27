import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

// Middleware xử lý lỗi tập trung — Constitution: 1 chỗ duy nhất format lỗi.
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) {
    res.status(400).json({ message: 'Dữ liệu không hợp lệ.', errors: err.flatten().fieldErrors });
    return;
  }
  // eslint-disable-next-line no-console
  console.error('[error]', err);
  const message = err instanceof Error ? err.message : 'Lỗi máy chủ nội bộ.';
  res.status(500).json({ message });
}

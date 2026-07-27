import type { Request, Response, NextFunction, RequestHandler } from 'express';

// Bọc controller async để lỗi throw được chuyển sang error middleware.
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

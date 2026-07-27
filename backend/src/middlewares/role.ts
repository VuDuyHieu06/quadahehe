import type { Request, Response, NextFunction } from 'express';

export function requireRole(...roles: Array<'CUSTOMER' | 'ADMIN'>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Chưa xác thực.' });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Không đủ quyền truy cập.' });
      return;
    }
    next();
  };
}

export const adminOnly = requireRole('ADMIN');
export const customerOnly = requireRole('CUSTOMER');

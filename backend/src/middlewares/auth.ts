import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

// Mở rộng Express Request để có user sau khi xác thực JWT.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: { userId: number; role: 'CUSTOMER' | 'ADMIN' };
    }
  }
}

export function authRequired(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Thiếu token xác thực.' });
    return;
  }
  const token = header.slice('Bearer '.length).trim();
  try {
    const payload = verifyToken(token);
    req.user = { userId: payload.userId, role: payload.role };
    next();
  } catch {
    res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
  }
}

import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ok, fail } from '../../utils/api';
import { authService } from './auth.service';

export class AuthController {
  register = asyncHandler(async (req, res) => {
    try {
      const result = await authService.register(req.body);
      return ok(res, result, 201);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Đăng ký thất bại.';
      return fail(res, message);
    }
  });

  login = asyncHandler(async (req, res) => {
    try {
      const result = await authService.login(req.body);
      return ok(res, result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Đăng nhập thất bại.';
      return fail(res, message, 401);
    }
  });

  me = asyncHandler(async (req, res) => {
    const user = await authService.me(req.user!.userId);
    return ok(res, user);
  });
}

export const authController = new AuthController();

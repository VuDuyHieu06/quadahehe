import { prisma } from '../../prisma/client';
import { hashPassword, comparePassword } from '../../utils/password';
import { signToken } from '../../utils/jwt';
import { Prisma } from '@prisma/client';
import type { RegisterInput, LoginInput } from './auth.validator';

export class AuthService {
  // Đăng ký tài khoản; email duy nhất, mặc định CUSTOMER.
  async register(input: RegisterInput) {
    const passwordHash = await hashPassword(input.password);
    try {
      const user = await prisma.user.create({
        data: {
          full_name: input.full_name,
          email: input.email.toLowerCase(),
          password_hash: passwordHash,
          phone: input.phone,
          role: input.role,
        },
        select: { user_id: true, full_name: true, email: true, role: true, phone: true },
      });
      return {
        user,
        token: signToken({ userId: user.user_id, role: user.role }),
      };
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new Error('Email đã được sử dụng.');
      }
      throw err;
    }
  }

  // Đăng nhập: kiểm tra email + mật khẩu, phát JWT.
  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });
    if (!user) throw new Error('Email hoặc mật khẩu không đúng.');
    const ok = await comparePassword(input.password, user.password_hash);
    if (!ok) throw new Error('Email hoặc mật khẩu không đúng.');

    return {
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
      token: signToken({ userId: user.user_id, role: user.role }),
    };
  }

  // Lấy thông tin user hiện tại từ JWT.
  async me(userId: number) {
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      select: { user_id: true, full_name: true, email: true, role: true, phone: true },
    });
    if (!user) throw new Error('Không tìm thấy người dùng.');
    return user;
  }
}

export const authService = new AuthService();

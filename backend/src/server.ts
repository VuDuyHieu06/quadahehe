import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler } from './middlewares/error';
import { authRoutes } from './modules/auth/auth.routes';
import { hotelRoutes } from './modules/hotels/hotel.routes';
import { roomTypeRoutes } from './modules/roomTypes/roomType.routes';
import { roomRoutes } from './modules/rooms/room.routes';
import { amenityRoutes } from './modules/amenities/amenity.routes';
import { bookingRoutes } from './modules/bookings/booking.routes';

const app = express();

// CORS: chấp nhận các origin trong CLIENT_URL (phân tách dấu phẩy) — production whitelist.
// Dev: tự động cho phép mọi origin http://localhost / http://127.0.0.1 ở bất kỳ port nào,
// để khỏi phải đặt CLIENT_URL mỗi khi Vite đổi port (5173, 5174 ...). Postman
// (không có Origin header) vẫn cho qua.
const allowedOrigins = env.clientUrl.split(',').map((o) => o.trim()).filter(Boolean);
const isDevLocalhost = (origin: string) =>
  /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin) || isDevLocalhost(origin)) {
        return cb(null, true);
      }
      return cb(new Error(`Origin ${origin} không được CORS cho phép.`));
    },
    credentials: true,
  }),
);
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => res.json({ data: { status: 'ok', service: 'stayhub-api' } }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);          // bao gồm /hotels/:id/reviews và /hotels/:id/room-types
app.use('/api/room-types', roomTypeRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/amenities', amenityRoutes);
app.use('/api/bookings', bookingRoutes);

app.use(errorHandler);

app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`STAYHUB API on http://localhost:${env.port}`);
});

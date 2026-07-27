# Stayhub — Hệ thống Quản lý & Đặt phòng Khách sạn

Đồ án môn **Lập trình Web nâng cao** — ứng dụng Full-stack đặt phòng khách sạn, tham khảo các tính năng hay của Booking.com nhưng có giao diện & nhận diện riêng **"Radiant Hope Hotel"**.

## Tech Stack
- **Frontend**: React 18 (Vite) + Tailwind CSS + React Router + Zustand + Axios
- **Backend**: Node.js + Express.js (RESTful API) + zod validation
- **Database**: MySQL (Prisma ORM)
- **Auth**: JWT (phân quyền `CUSTOMER` / `ADMIN`)

## Cấu trúc thư mục
```
stayhub/
├── backend/      # Express + Prisma + MySQL
│   ├── prisma/   # schema.prisma (8 bảng) + seed.ts
│   └── src/      # config, middlewares, utils, modules/
├── frontend/     # React (Vite) + Tailwind
│   └── src/      # api, store, routes, components, hooks, types
├── docker-compose.yml   # MySQL + phpMyAdmin
└── docs/constitution.md  # Tiêu chuẩn coding
```

## Quick start

### 1. Chạy MySQL bằng Docker
```bash
docker compose up -d
# MySQL trên :3306, phpMyAdmin trên http://localhost:8080
```

### 2. Backend
```bash
cd backend
cp .env.example .env
npm install
npx prisma db push
npm run seed                          # nạp dữ liệu mẫu
npm run dev                           # API trên http://localhost:4000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev    # http://localhost:5173 (proxy /api -> :4000)
```

## Tài khoản demo (seed)
| Vai trò | Email | Mật khẩu |
|---------|-------|----------|
| Admin | `admin@stayhub.vn` | `admin123` |
| Customer | `customer@stayhub.vn` | `customer123` |

## Cơ sở dữ liệu (8 bảng)
1. **Users** — tài khoản + role (CUSTOMER/ADMIN)
2. **Hotels** — khách sạn (property_type HOTEL/RESORT/VILLA/APARTMENT, star_rating)
3. **Room_Types** — dạng phòng (capacity, price_per_night)
4. **Rooms** — phòng vật lý (room_number 101, 102..., status: available/maintenance/booked)
5. **Amenities** — tiện ích
6. **Hotel_Amenities** — bảng trung gian N-N
7. **Bookings** — đơn đặt (check_in, check_out, total_price, status)
8. **Reviews** — đánh giá (rating 1-5, chỉ user đã completed)

### Chống overbooking
Tách biệt `Room_Types` (mô tả) và `Rooms` (phòng vật lý). API đặt phòng chạy trong **Prisma transaction**: kiểm ko overlap booking → tạo booking → chuyển `Room.status = booked`. `@@unique([room_id, check_in_date, check_out_date])`.

## Tính năng chính
- Customer: đăng ký/đăng nhập, tìm kiếm (điểm đến, ngày, số khách), lọc (giá, sao, tiện ích), 4 loại chỗ nghỉ, đặt phòng, xem đơn, đánh giá (sau khi completed), cảnh báo "Chỉ còn X phòng!".
- Admin: dashboard thống kê, CRUD khách sạn/tiện ích, CRUD phòng vật lý + đổi trạng thái, duyệt/huỷ/hoàn thành đơn.

## REST API rút gọn
```
POST   /api/auth/register | /login        GET /api/auth/me
GET    /api/hotels (filters)   GET /api/hotels/:id
POST/PUT/DELETE /api/hotels/:id            (admin)
GET    /api/hotels/:hotelId/room-types
GET    /api/rooms/:roomTypeId/available?checkIn=&checkOut=
POST/PATCH/DELETE /api/rooms               (admin)
GET    /api/amenities
POST   /api/bookings   GET /api/bookings/my   GET /api/bookings (admin)
PATCH  /api/bookings/:id/status             (admin)
GET    /api/hotels/:hotelId/reviews
POST   /api/hotels/:hotelId/reviews         (customer, đã completed)
```

## Constitution
Xem [docs/constitution.md](docs/constitution.md) — Clean Code, SOLID (tách routes/controller/service/validator), không đạo nhái.

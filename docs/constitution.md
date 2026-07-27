# Constitution — Tiêu chuẩn coding của dự án "stayhub"

Dự án này tham khảo các tính năng hay của Booking.com nhưng KHÔNG được copy nguyên văn code hoặc asset. Mọi dòng code do chính team viết, ghi chú nghiệp vụ bằng tiếng Việt khi cần.

## 1. Clean Code
- Tên biến/hàm/class đặt tiếng Anh, mô tả đúng ý nghĩa nghiệp vụ.
- Mỗi hàm làm đúng 1 việc, độ dài vừa phải (< ~40 dòng).
- Không để code chết, comment không giải thích "what" mà giải thích "why".
- Tránh magic number/string — định nghĩa hằng số/enum.

## 2. SOLID (Backend đặc biệt)
- **SRP**: Mỗi module backend tách 4 lớp rõ ràng:
  - `routes` — chỉ khai báo endpoint + gắn middleware + gọi controller.
  - `controller` — mỏng, chỉ parse request, gọi service, format response.
  - `service` — chứa logic nghiệp vụ, thao tác Prisma.
  - `validator` — schema zod, validate input.
- **OCP**: Thêm tính năng bằng module/tạo file mới, không sửa endlessly hàm cũ.
- **DIP**: Service phụ thuộc Prisma client qua dependency truyền vào hoặc singleton, không `new` rải rác.

## 3. Frontend
- Tái dùng UI primitives (Button, Modal, Badge, StarRating, Toast) — không lặp markup.
- Component chia theo domain (layout, hotel, booking, filters, ui).
- State toàn cục (auth) bằng zustand; state server (dữ liệu từ API) bằng react-query hoặc hook `useFetch` đơn giản.
- Đường dẫn API tập trung ở `src/api/`, không gọi axios trực tiếp trong component.

## 4. Naming & Cấu trúc
- Backend: thư mục theo `src/modules/<tên resource>` để dễ mở rộng.
- Frontend: `routes/` (page), `components/` (ui tái dùng), `hooks/`, `lib/`, `types/`.
- File tiếng Anh dùng kebab-case (`room-type.service.ts`).

## 5. Quy ước API
- RESTful: `GET/POST/PUT/PATCH/DELETE` dùng đúng ngữ nghĩa.
- Response thống nhất: `{ data }` thành công, `{ message, errors }` khi lỗi.
- Lỗi tập trung qua `error.ts` middleware.
- Xác thực JWT qua header `Authorization: Bearer <token>`. Phân quyền qua middleware `role`.

## 6. Database
- Tách biệt `Room_Types` (mô tả) và `Rooms` (phòng vật lý) để chống overbooking.
- Trạng thái phòng dùng enum (`available`, `maintenance`, `booked`).
- Booking dùng `@@unique([room_id, check_in_date, check_out_date])` + transaction khi đặt để tránh trùng lịch.

## 7. Không đạo nhái
- Asset ảnh dùng URL Unsplash (demo) hoặc asset do team tạo. Không bóc tách HTML/CSS nguyên khối từ Booking.com.
- UI/UX tự thiết kế theo nhận diện "Radiant Hope Hotel" (palette, logo riêng).

/**
 * Seed dữ liệu mẫu cho stayhub (Radiant Hope Hotel).
 * Chạy: npm run seed  (sau khi đã prisma migrate dev)
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Ảnh demo dùng picsum.photos (ổn định, không 404). seed số cố định -> mỗi KS ảnh khác nhau.
const IMG = (seed: number) => `https://picsum.photos/seed/stayhub${seed}/1200/800`;

async function main() {
  console.log('Seeding...');

  // Xoá dữ liệu cũ (theo thứ tự FK) -> seed có thể chạy lại nhiều lần.
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();
  await prisma.roomType.deleteMany();
  await prisma.hotelAmenity.deleteMany();
  await prisma.amenity.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.user.deleteMany();

  // ----- Users -----
  const adminPass = await bcrypt.hash('admin123', 10);
  const custPass = await bcrypt.hash('customer123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@stayhub.vn' },
    update: {},
    create: { full_name: 'Quản trị viên', email: 'admin@stayhub.vn', password_hash: adminPass, role: 'ADMIN', phone: '0900000001' },
  });
  const customer = await prisma.user.upsert({
    where: { email: 'customer@stayhub.vn' },
    update: {},
    create: { full_name: 'Nguyễn Văn Khách', email: 'customer@stayhub.vn', password_hash: custPass, role: 'CUSTOMER', phone: '0900000002' },
  });

  // ----- Amenities -----
  const amenityNames = ['WiFi miễn phí', 'Hồ bơi', 'Spa', 'Bãi đỗ xe', 'Gym', 'Nhà hàng', 'Đón sân bay', 'Điều hòa'];
  const amenities = await Promise.all(
    amenityNames.map((name) => prisma.amenity.upsert({ where: { name }, update: {}, create: { name } })),
  );
  const amId = (name: string) => amenities.find((a) => a.name === name)!.amenity_id;

  // ----- Hotels (10 khách sạn, đủ 4 loại chỗ nghỉ, rải 5 thành phố) -----
  const hotelsData = [
    { name: 'Radiant Hope Grand Đà Nẵng', property_type: 'HOTEL' as const, city: 'Đà Nẵng', address: 'Bãi biển Mỹ Khê, Sơn Trà', star_rating: 5, desc: 'Khách sạn 5 sao ven biển với tầm nhìn ra biển tuyệt đẹp.', imgs: [10, 11, 12, 13], ami: ['WiFi miễn phí','Hồ bơi','Spa','Bãi đỗ xe','Gym','Nhà hàng','Điều hòa'] },
    { name: 'Đà Nẵng Ocean Boutique', property_type: 'HOTEL' as const, city: 'Đà Nẵng', address: 'Võ Nguyên Giáp, Sơn Trà', star_rating: 4, desc: 'Boutique hotel gần cầu Rồng, view biển đầy thơ.', imgs: [14, 15, 16, 17], ami: ['WiFi miễn phí','Hồ bơi','Bãi đỗ xe','Nhà hàng','Điều hòa'] },
    { name: 'Pacific Pearl Resort Hội An', property_type: 'RESORT' as const, city: 'Hội An', address: 'Cửa Đại, Hội An', star_rating: 5, desc: 'Resort nghỉ dưỡng toàn diện giữa vườn nhiệt đới.', imgs: [20, 21, 22, 23], ami: ['WiFi miễn phí','Hồ bơi','Spa','Bãi đỗ xe','Gym','Nhà hàng','Đón sân bay','Điều hòa'] },
    { name: 'Hoi An Heritage Hotel', property_type: 'HOTEL' as const, city: 'Hội An', address: 'Phố cổ Hội An', star_rating: 4, desc: 'Boutique hotel phong cách kiến trúc cổ, ngay giữa phố cổ.', imgs: [30, 31, 32], ami: ['WiFi miễn phí','Điều hòa','Bãi đỗ xe','Nhà hàng'] },
    { name: 'Sai Gon Sky Apartment', property_type: 'APARTMENT' as const, city: 'TP. Hồ Chí Minh', address: 'Quận 1, trung tâm', star_rating: 4, desc: 'Căn hộ dịch vụ đầy đủ tiện nghi, trung tâm Q1.', imgs: [40, 41, 42], ami: ['WiFi miễn phí','Điều hòa','Bãi đỗ xe','Gym'] },
    { name: 'Saigon Riverside Villa', property_type: 'VILLA' as const, city: 'TP. Hồ Chí Minh', address: 'Thảo Điền, Quận 2', star_rating: 5, desc: 'Biệt thự ven sông khu expat, yên tĩnh giữa lòng Sài Gòn.', imgs: [43, 44, 45], ami: ['WiFi miễn phí','Hồ bơi','Điều hòa','Bãi đỗ xe','Gym'] },
    { name: 'Da Lat Pine Villa', property_type: 'VILLA' as const, city: 'Đà Lạt', address: 'Đồi thông Vàng, Đà Lạt', star_rating: 5, desc: 'Biệt thự gỗ giữa rừng thông nguyên sinh, lò sưởi ấm áp.', imgs: [50, 51, 52], ami: ['WiFi miễn phí','Điều hòa','Bãi đỗ xe','Hồ bơi'] },
    { name: 'Da Lat Garden Resort', property_type: 'RESORT' as const, city: 'Đà Lạt', address: 'Đường Trần Hưng Đạo, Đà Lạt', star_rating: 4, desc: 'Resort vườn hoa tam giác mạch, gần hồ Xuân Hương.', imgs: [53, 54, 55, 56], ami: ['WiFi miễn phí','Điều hòa','Nhà hàng','Hồ bơi','Bãi đỗ xe'] },
    { name: 'Ha Noi Old Quarter Inn', property_type: 'HOTEL' as const, city: 'Hà Nội', address: 'Phố cổ, Hoàn Kiếm', star_rating: 3, desc: 'Khách sạn nhỏ ấm cúng tại phố cổ, gần hồ Gươm.', imgs: [70, 71, 72], ami: ['WiFi miễn phí','Điều hòa','Nhà hàng'] },
    { name: 'Hanoi Westlake Boutique', property_type: 'HOTEL' as const, city: 'Hà Nội', address: 'Tây Hồ, ven hồ Tây', star_rating: 4, desc: 'Boutique ven hồ Tây, hướng hoàng hôn lãng mạn.', imgs: [73, 74, 75], ami: ['WiFi miễn phí','Điều hòa','Bãi đỗ xe','Nhà hàng','Gym'] },
  ];

  for (const h of hotelsData) {
    const hotel = await prisma.hotel.create({
      data: {
        name: h.name,
        property_type: h.property_type,
        city: h.city,
        address: h.address,
        description: h.desc,
        star_rating: h.star_rating,
        images: h.imgs.map(IMG),
        amenities: { create: h.ami.map((name) => ({ amenity_id: amId(name) })) },
      },
    });

    // 2 loại phòng mỗi khách sạn
    const roomTypesData = [
      { name: 'Standard', capacity: 2, price: 800000, roomCount: 2, startNum: 101 },
      { name: 'Deluxe', capacity: 3, price: 1500000, roomCount: 2, startNum: 201 },
    ];
    for (const rt of roomTypesData) {
      const roomType = await prisma.roomType.create({
        data: { hotel_id: hotel.hotel_id, name: rt.name, capacity: rt.capacity, price_per_night: rt.price },
      });
      for (let i = 0; i < rt.roomCount; i++) {
        await prisma.room.create({
          data: {
            room_type_id: roomType.room_type_id,
            room_number: String(rt.startNum + i),
            status: 'available',
          },
        });
      }
    }
  }
  console.log('Hotels + RoomTypes + Rooms seeded.');

  // ----- 1 booking COMPLETED cho customer ở Đà Nẵng (để được review) -----
  const grandHotel = await prisma.hotel.findFirst({ where: { name: 'Radiant Hope Grand Đà Nẵng' } });
  const grandRoomType = await prisma.roomType.findFirst({ where: { hotel_id: grandHotel!.hotel_id, name: 'Deluxe' } });
  const grandRoom = await prisma.room.findFirst({ where: { room_type_id: grandRoomType!.room_type_id } });
  if (grandRoom) {
    const past = new Date();
    past.setDate(past.getDate() - 30);
    const pastOut = new Date();
    pastOut.setDate(pastOut.getDate() - 27);
    await prisma.booking.create({
      data: {
        user_id: customer.user_id,
        room_id: grandRoom.room_id,
        check_in_date: past,
        check_out_date: pastOut,
        total_price: 4500000,
        status: 'completed',
      },
    });
    await prisma.review.create({
      data: { hotel_id: grandHotel!.hotel_id, user_id: customer.user_id, rating: 5, comment: 'Dịch vụ tuyệt vời, view biển đẹp. Sẽ quay lại!' },
    });
  }

  // ----- Thêm vài review khác cho nhiều khách sạn (lấy id động) -----
  const allHotels = await prisma.hotel.findMany({ select: { hotel_id: true, name: true }, orderBy: { hotel_id: 'asc' } });
  const reviews = [
    { name: 'Pacific Pearl Resort Hội An', rating: 5, comment: 'Resort xinh đẹp, nhân viên thân thiện.' },
    { name: 'Hoi An Heritage Hotel', rating: 4, comment: 'Vị trí trung tâm phố cổ, rất tiện.' },
  ];
  for (const rv of reviews) {
    const h = allHotels.find((x) => x.name === rv.name);
    if (h) {
      await prisma.review.upsert({
        where: { hotel_id_user_id: { hotel_id: h.hotel_id, user_id: customer.user_id } },
        update: { rating: rv.rating, comment: rv.comment },
        create: { hotel_id: h.hotel_id, user_id: customer.user_id, rating: rv.rating, comment: rv.comment },
      });
    }
  }

  console.log('Seed hoàn tất!');
  console.log('  Admin   : admin@stayhub.vn / admin123');
  console.log('  Khách   : customer@stayhub.vn / customer123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

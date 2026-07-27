import { TabsNav } from '../components/layout/TabsNav';
import { PropertyTypeGrid } from '../components/hotel/PropertyTypeGrid';

export function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div
          className="h-[420px] bg-cover bg-center"
          style={{ backgroundImage: "url('https://picsum.photos/seed/stayhubhero/1600/900')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
        </div>
        <div className="absolute inset-x-0 top-16 mx-auto max-w-7xl px-4">
          <div className="mb-4">
            <TabsNav />
          </div>
        </div>
      </section>

      <PropertyTypeGrid />

      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="rounded-2xl bg-brand-50 p-8 text-center">
          <h2 className="mb-2 text-2xl font-bold text-brand-700">Tại sao chọn Radiant Hope?</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { t: 'Giá tốt nhất', d: 'Cam kết giá cạnh tranh cho từng phòng.' },
              { t: 'Đặt phòng tức thì', d: 'Xác nhận nhanh, chống trùng lịch.' },
              { t: 'Đánh giá thật', d: 'Chỉ khách đã ở mới được review.' },
            ].map((f) => (
              <div key={f.t} className="rounded-xl bg-white p-5 text-left shadow-sm">
                <div className="font-bold text-gray-900">{f.t}</div>
                <div className="mt-1 text-sm text-gray-500">{f.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

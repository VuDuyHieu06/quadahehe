import { NavLink, Outlet } from 'react-router-dom';

const NAV = [
  { to: '/admin', label: 'Tổng quan', end: true },
  { to: '/admin/hotels', label: 'Khách sạn & loại phòng' },
  { to: '/admin/rooms', label: 'Phòng vật lý' },
  { to: '/admin/bookings', label: 'Đơn đặt' },
];

export function AdminLayout() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Bảng điều khiển Quản trị</h1>
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-1 lg:flex-col">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `rounded-lg px-4 py-2.5 text-sm font-medium ${isActive ? 'bg-brand-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

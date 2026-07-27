import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';

export function Navbar() {
  const { user, logout, isAdmin } = useAuthStore();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white font-bold">R</div>
          <div className="leading-none">
            <div className="text-lg font-bold text-gray-900">Radiant Hope</div>
            <div className="text-[10px] uppercase tracking-widest text-brand-600">Hotel & Booking</div>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          {user ? (
            <>
              <Link to="/" className="px-3 text-sm font-medium text-gray-700 hover:text-brand-600">Trang chủ</Link>
              <Link to="/my-bookings" className="px-3 text-sm font-medium text-gray-700 hover:text-brand-600">Đơn của tôi</Link>
              {isAdmin() && (
                <Link to="/admin" className="px-3 text-sm font-medium text-brand-700 hover:underline">Quản trị</Link>
              )}
              <span className="hidden text-sm text-gray-500 sm:inline">Hi, {user.full_name.split(' ').pop()}</span>
              <Button variant="secondary" size="sm" onClick={() => { logout(); void navigate('/'); }}>
                Đăng xuất
              </Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button variant="ghost" size="sm">Đăng nhập</Button></Link>
              <Link to="/register"><Button size="sm">Đăng ký</Button></Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

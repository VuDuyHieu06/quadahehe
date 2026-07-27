import { Navigate, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { useAuthStore } from './store/authStore';
import { Home } from './routes/Home';
import { Search } from './routes/Search';
import { HotelDetail } from './routes/HotelDetail';
import { Login } from './routes/Login';
import { Register } from './routes/Register';
import { Booking } from './routes/Booking';
import { MyBookings } from './routes/MyBookings';
import { AdminLayout } from './routes/admin/AdminLayout';
import { Dashboard } from './routes/admin/Dashboard';
import { AdminHotels } from './routes/admin/AdminHotels';
import { AdminRooms } from './routes/admin/AdminRooms';
import { AdminBookings } from './routes/admin/AdminBookings';

function Private({ children, role }: { children: JSX.Element; role?: 'CUSTOMER' | 'ADMIN' }) {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/hotels/:id" element={<HotelDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/booking/:roomTypeId" element={<Private><Booking /></Private>} />
          <Route path="/my-bookings" element={<Private role="CUSTOMER"><MyBookings /></Private>} />

          <Route path="/admin" element={<Private role="ADMIN"><AdminLayout /></Private>}>
            <Route index element={<Dashboard />} />
            <Route path="hotels" element={<AdminHotels />} />
            <Route path="rooms" element={<AdminRooms />} />
            <Route path="bookings" element={<AdminBookings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

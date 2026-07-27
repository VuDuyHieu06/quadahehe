import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../components/ui/Toast';
import { Input, Label } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export function Register() {
  const [form, setForm] = useState({ full_name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const toast = useToast();
  const navigate = useNavigate();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.register(form);
      setAuth(res.user as any, res.token);
      toast.push('Đăng ký thành công!', 'success');
      void navigate('/');
    } catch (err) {
      toast.push(err instanceof Error ? err.message : 'Đăng ký thất bại.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Đăng ký</h1>
      <form onSubmit={submit} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
        <div><Label>Họ và tên</Label><Input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
        <div><Label>Email</Label><Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div><Label>Số điện thoại</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
        <div><Label>Mật khẩu</Label><Input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
        <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Đang xử lý...' : 'Đăng ký'}</Button>
        <p className="text-center text-sm text-gray-500">Đã có tài khoản? <Link to="/login" className="font-semibold text-brand-600">Đăng nhập</Link></p>
      </form>
    </div>
  );
}

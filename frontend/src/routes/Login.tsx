import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../components/ui/Toast';
import { Input, Label } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const toast = useToast();
  const navigate = useNavigate();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      setAuth(res.user as any, res.token);
      toast.push('Đăng nhập thành công!', 'success');
      void navigate(res.user.role === 'ADMIN' ? '/admin' : '/');
    } catch (err) {
      toast.push(err instanceof Error ? err.message : 'Đăng nhập thất bại.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Đăng nhập</h1>
      <form onSubmit={submit} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
        <div>
          <Label>Email</Label>
          <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div>
          <Label>Mật khẩu</Label>
          <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Đang xử lý...' : 'Đăng nhập'}</Button>
        <p className="text-center text-sm text-gray-500">
          Chưa có tài khoản? <Link to="/register" className="font-semibold text-brand-600">Đăng ký</Link>
        </p>
        <p className="rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
          Demo:<br />Admin — admin@stayhub.vn / admin123<br />Khách — customer@stayhub.vn / customer123
        </p>
      </form>
    </div>
  );
}

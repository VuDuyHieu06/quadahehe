import axios from 'axios';

// Instance axios duy nhất. Env VITE_API_URL dùng khi build; dev đi qua proxy Vite.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Gắn JWT vào header mỗi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('stayhub_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Bọc lỗi thống nhất -> Error(message)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message || err.message || 'Lỗi mạng.';
    return Promise.reject(new Error(msg));
  },
);

// Helper: API backend luôn trả { data } -> unwrap lấy phần data.
// axios ở đây dùng mặc định (không generic), nên res.data = { data: T }.
export function unwrap<T>(res: { data: { data: T } }): T {
  return res.data.data;
}

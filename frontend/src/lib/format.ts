const nf = new Intl.NumberFormat('vi-VN');
export function formatVND(n: number | null | undefined): string {
  if (n == null) return '—';
  return `${nf.format(n)}₫`;
}
export function nights(checkIn: string, checkOut: string): number {
  const d1 = new Date(checkIn).getTime();
  const d2 = new Date(checkOut).getTime();
  return Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
}

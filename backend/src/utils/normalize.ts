// Bỏ dấu tiếng Việt + lower-case + trim để so khớp mờ.
// "Đà Nẵng", "Da Nang", "da nang" => "da nang".
export function normalizeSearch(s: string | undefined | null): string {
  if (!s) return '';
  return s
    .normalize('NFD')                 // tách dấu ra khỏi chữ cái gốc
    .replace(/[\u0300-\u036f]/g, '')  // bỏ dấu tổ hợp
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .trim();
}

// Kiểm tra 1 trường chứa từ khoá tìm kiếm (sau khi normalize).
export function matchesSearch(field: string | null | undefined, keyword: string): boolean {
  if (!keyword) return true; // không có từ khoá -> luôn khớp
  return normalizeSearch(field).includes(keyword);
}

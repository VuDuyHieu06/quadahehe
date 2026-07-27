// Helper ghép class có điều kiện (thay classnames lib).
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

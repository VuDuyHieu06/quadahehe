import { cn } from '../../lib/cn';

interface StarRatingProps {
  value: number; // 0..5, cho phép lẻ
  size?: 'sm' | 'md';
  showNumber?: boolean;
  className?: string;
}

// Vẽ sao đầy/rỗng theo giá trị; hiển thị số khi showNumber.
export function StarRating({ value, size = 'sm', showNumber, className }: StarRatingProps) {
  const full = Math.round(value);
  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      <span className={cn('inline-flex', size === 'md' ? 'text-lg' : 'text-sm')}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={i < full ? 'text-amber-400' : 'text-gray-300'}>
            ★
          </span>
        ))}
      </span>
      {showNumber && <span className="text-xs font-medium text-gray-600">{value.toFixed(1)}</span>}
    </span>
  );
}

import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface BadgeProps {
  children: ReactNode;
  color?: 'gray' | 'brand' | 'green' | 'red' | 'amber' | 'blue';
  className?: string;
}

const colors: Record<NonNullable<BadgeProps['color']>, string> = {
  gray: 'bg-gray-100 text-gray-700',
  brand: 'bg-brand-100 text-brand-700',
  green: 'bg-green-100 text-green-700',
  red: 'bg-red-100 text-red-700',
  amber: 'bg-amber-100 text-amber-700',
  blue: 'bg-blue-100 text-blue-700',
};

export function Badge({ children, color = 'gray', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium', colors[color], className)}>
      {children}
    </span>
  );
}

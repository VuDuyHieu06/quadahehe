import { useState } from 'react';
import { cn } from '../../lib/cn';

const FALLBACK = 'https://placehold.co/800x600/EDE9E1/6b6356?text=Radiant+Hope';

interface HotelImageProps {
  src: string;
  alt: string;
  className?: string;
}

// Ảnh khách sạn có fallback: nếu URL hỏng (ví dụ Unsplash xoá 404) -> placeholder Radiant Hope.
export function HotelImage({ src, alt, className }: HotelImageProps) {
  const [errored, setErrored] = useState(false);
  return (
    <img
      src={errored ? FALLBACK : src}
      alt={alt}
      loading="lazy"
      onError={() => setErrored(true)}
      className={cn('object-cover', className)}
    />
  );
}

import { useState } from 'react';
import { HotelImage } from './HotelImage';

export function ImageGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : ['https://placehold.co/800x600?text=No+image'];
  return (
    <div className="grid gap-2 md:grid-cols-4">
      <div className="md:col-span-3">
        <HotelImage src={list[active]} alt={name} className="h-72 w-full rounded-xl md:h-96" />
      </div>
      <div className="grid grid-cols-4 gap-2 md:grid-cols-1">
        {list.slice(0, 4).map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`overflow-hidden rounded-lg border-2 ${active === i ? 'border-brand-500' : 'border-transparent'}`}
          >
            <HotelImage src={img} alt={`${name} ${i + 1}`} className="h-16 w-full md:h-20" />
          </button>
        ))}
      </div>
    </div>
  );
}

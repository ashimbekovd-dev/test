"use client";

import { useState } from "react";
import { ProductImage } from "@/components/ProductImage";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="overflow-hidden rounded-[var(--radius-card)]">
        <ProductImage src={images[active]} alt={alt} sizes="(min-width: 768px) 50vw, 100vw" priority />
      </div>
      {images.length > 1 && (
        <ul className="mt-3 flex gap-2" aria-label="Фото товара">
          {images.map((src, i) => (
            <li key={src} className="w-16">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Фото ${i + 1} из ${images.length}`}
                aria-current={i === active}
                className={`block w-full overflow-hidden rounded-lg border-2 ${i === active ? "border-graphite" : "border-transparent"}`}
              >
                <ProductImage src={src} alt="" sizes="64px" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

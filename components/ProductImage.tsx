import Image from "next/image";
import { canOptimize } from "@/lib/images";

type Props = { src: string; alt: string; sizes: string; priority?: boolean; className?: string };

/** Фото 4:5 на светлой подложке. Внешние домены без оптимизации — страница не падает. */
export function ProductImage({ src, alt, sizes, priority, className = "" }: Props) {
  return (
    <div className={`relative aspect-[4/5] overflow-hidden bg-pad ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={!canOptimize(src)}
        className="object-cover mix-blend-multiply"
      />
    </div>
  );
}

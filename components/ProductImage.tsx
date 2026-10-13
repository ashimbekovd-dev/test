import Image from "next/image";

const OPTIMIZED_HOSTS = ["static.tildacdn.pro", "static.tildacdn.com", "thb.tildacdn.pro", "thb.tildacdn.com"];

/** Any URL from the sheet must render: unknown hosts and SVGs skip the optimizer instead of crashing. */
export function ProductImage({ src, alt, sizes, priority }: { src: string; alt: string; sizes: string; priority?: boolean }) {
  let optimize = false;
  try {
    const u = new URL(src, "http://local");
    optimize = OPTIMIZED_HOSTS.includes(u.hostname) && !u.pathname.endsWith(".svg");
  } catch {
    optimize = false;
  }
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} unoptimized={!optimize} className="object-cover" />;
}

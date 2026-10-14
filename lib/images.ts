const OPTIMIZED_HOSTS = new Set(["static.tildacdn.pro", "thb.tildacdn.pro", "static.tildacdn.com", "thb.tildacdn.com"]);

/** true — URL можно пропускать через оптимизатор next/image; иначе нужен unoptimized. */
export function canOptimize(src: string): boolean {
  try {
    const u = new URL(src);
    return u.protocol === "https:" && OPTIMIZED_HOSTS.has(u.hostname);
  } catch {
    return false;
  }
}

import { notFound, permanentRedirect } from "next/navigation";
import { LEGACY_PAGES } from "@/lib/legacy";

/**
 * Разделы старого сайта на Tilda (/brand, /uhodovie, /piyol…) → новые страницы.
 * Любой другой незнакомый адрес — обычная страница «не найдено».
 */
export default async function LegacySection({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const to = LEGACY_PAGES[`/${decodeURIComponent(section)}`];
  if (!to) notFound();
  permanentRedirect(to);
}

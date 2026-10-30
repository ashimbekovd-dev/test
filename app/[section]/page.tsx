import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { LEGACY_PAGES } from "@/lib/legacy";
import { SECTIONS } from "@/lib/sections";
import { CatalogView } from "@/components/CatalogView";
import { catalogMetadata } from "@/lib/catalog-meta";

export const revalidate = 300;

type Props = { params: Promise<{ section: string }> };

export function generateStaticParams() {
  return Object.keys(SECTIONS).map((p) => ({ section: p.slice(1) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = SECTIONS[`/${decodeURIComponent((await params).section)}`];
  return s ? catalogMetadata({ ...s, sort: "default" }) : {};
}

/**
 * Адреса старого сайта на Tilda:
 * • разделы каталога (/piyol, /uhodovie…) — живые страницы с теми же адресами;
 * • остальные (/brand, /test…) — перенаправление на новые страницы;
 * • незнакомый адрес — «страница не найдена».
 */
export default async function Section({ params }: Props) {
  const path = `/${decodeURIComponent((await params).section)}`;
  const s = SECTIONS[path];
  if (s) return <CatalogView query={{ ...s, sort: "default" }} />;
  const to = LEGACY_PAGES[path];
  if (!to) notFound();
  permanentRedirect(to);
}

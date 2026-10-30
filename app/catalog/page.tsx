import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { parseCatalogQuery } from "@/lib/catalog/query";
import { CatalogView } from "@/components/CatalogView";
import { catalogMetadata } from "@/lib/catalog-meta";
import { sectionFor } from "@/lib/sections";

export const revalidate = 300;

type SP = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: SP): Promise<Metadata> {
  return catalogMetadata(parseCatalogQuery(await searchParams));
}

export default async function CatalogPage({ searchParams }: SP) {
  const query = parseCatalogQuery(await searchParams);
  // /catalog?category=Очищение → /ochishenie: у раздела один адрес, тот же, что был на Tilda
  const section = sectionFor(query);
  if (section) permanentRedirect(section);
  return <CatalogView query={query} />;
}

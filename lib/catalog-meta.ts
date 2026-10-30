import type { Metadata } from "next";
import type { CatalogQuery } from "@/lib/catalog/query";
import { CATALOG_SEO, CATEGORY_SEO, CONCERN_SEO, type SeoPage } from "@/lib/seo-pages";
import { catalogHref, sectionFor } from "@/lib/sections";

/** Мета-теги страницы каталога: разделы и задачи кожи индексируются, поиск и сочетания фильтров — нет. */
export function catalogMetadata(query: CatalogQuery): Metadata {
  const isPlain = !query.q && !query.brand && !query.category && !query.concern && (query.sort ?? "default") === "default";
  const onlyCategory = !!query.category && !query.concern && !query.q && !query.brand && (query.sort ?? "default") === "default";
  const onlyConcern = !!query.concern && !query.category && !query.q && !query.brand && (query.sort ?? "default") === "default";
  let page: SeoPage = CATALOG_SEO;
  let indexable = isPlain;
  if (onlyCategory && CATEGORY_SEO[query.category!]) {
    page = CATEGORY_SEO[query.category!];
    indexable = true;
  } else if (onlyConcern && CONCERN_SEO[query.concern!]) {
    page = CONCERN_SEO[query.concern!];
    indexable = true;
  }
  const canonical = indexable ? (sectionFor(query) ?? catalogHref(query)) : "/catalog";
  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical },
    robots: indexable ? undefined : { index: false, follow: true },
    openGraph: { title: page.title, description: page.description, url: canonical },
  };
}

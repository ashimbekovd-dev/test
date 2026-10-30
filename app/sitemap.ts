import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/products/source";
import { LINES } from "@/lib/lines";
import { absoluteUrl } from "@/lib/site";
import { CATEGORY_SEO, CONCERN_SEO } from "@/lib/seo-pages";
import { getCategories } from "@/lib/products/source";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/catalog"), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/quiz"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/delivery"), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/contacts"), changeFrequency: "monthly", priority: 0.5 },
  ];
  const lines = LINES.map((l) => ({ url: absoluteUrl(`/lines/${l.slug}`), changeFrequency: "weekly" as const, priority: 0.8 }));
  const items = products.map((p) => ({
    url: absoluteUrl(`/product/${encodeURIComponent(p.sku)}`),
    changeFrequency: "weekly" as const,
    priority: 0.7,
    images: p.images.slice(0, 1).map((src) => (src.startsWith("http") ? src : absoluteUrl(src))),
  }));
  // Разделы и задачи кожи — только те, где есть товары и свой текст для поиска
  const categories = getCategories(products)
    .filter((c) => CATEGORY_SEO[c])
    .map((c) => ({ url: absoluteUrl(`/catalog?category=${encodeURIComponent(c)}`), changeFrequency: "weekly" as const, priority: 0.8 }));
  const concerns = Object.keys(CONCERN_SEO)
    .filter((slug) => products.some((p) => p.concerns.includes(slug)))
    .map((slug) => ({ url: absoluteUrl(`/catalog?concern=${slug}`), changeFrequency: "weekly" as const, priority: 0.8 }));
  return [...pages, ...lines, ...categories, ...concerns, ...items];
}

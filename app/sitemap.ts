import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/products/source";
import { LINES } from "@/lib/lines";
import { absoluteUrl } from "@/lib/site";

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
  return [...pages, ...lines, ...items];
}

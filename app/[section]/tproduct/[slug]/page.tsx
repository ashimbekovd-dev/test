import { permanentRedirect } from "next/navigation";
import { getProducts } from "@/lib/products/source";
import { legacySearchUrl, matchLegacyProduct } from "@/lib/legacy";

/** Старые ссылки на товары с Tilda: /uhodovie/tproduct/527865594-…-piyol-active-hydra-moist-serum */
export default async function LegacyProduct({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const skus = (await getProducts()).map((p) => p.sku);
  const sku = matchLegacyProduct(decodeURIComponent(slug), skus);
  permanentRedirect(sku ? `/product/${encodeURIComponent(sku)}` : legacySearchUrl(slug));
}

import Link from "next/link";
import { getBrands, getCategories, getProducts } from "@/lib/products/source";
import { queryCatalog, type CatalogQuery } from "@/lib/catalog/query";
import { CatalogFilters } from "@/components/CatalogFilters";
import { ProductGrid } from "@/components/ProductGrid";
import { getConcern } from "@/lib/concerns";
import { CATEGORY_SEO } from "@/lib/seo-pages";

function plural(n: number) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "средство";
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "средства";
  return "средств";
}

/** Страница каталога: заголовок, вводный текст раздела, фильтры и товары. */
export async function CatalogView({ query, heading }: { query: CatalogQuery; heading?: string }) {
  const products = await getProducts();
  const results = queryCatalog(products, query);
  const concern = getConcern(query.concern);
  const title = heading ?? concern?.title ?? query.category ?? (query.q ? `Поиск: ${query.q}` : "Каталог");
  const intro = !concern && query.category ? CATEGORY_SEO[query.category]?.intro : undefined;
  return (
    <div className="wrap pt-8 md:pt-12">
      <h1 className="text-[44px] md:text-[64px]">{title}</h1>
      {concern && <p className="mt-3 max-w-xl text-[17px]">{concern.lead}</p>}
      {intro && <p className="mt-3 max-w-2xl text-[16px] text-ink/80">{intro}</p>}
      <p className="mt-1 text-mute">{results.length} {plural(results.length)}</p>
      <div className="mt-6"><CatalogFilters query={query} categories={getCategories(products)} brands={getBrands(products)} /></div>
      <div className="mt-10">
        <h2 className="sr-only">Товары</h2>
        {results.length ? (
          <ProductGrid products={results} eager={4} />
        ) : (
          <div className="arch mx-auto max-w-md bg-petal/50 px-8 pb-10 pt-16 text-center">
            <h2 className="text-3xl">Ничего не нашли</h2>
            <p className="mt-2 text-mute">Попробуйте другое название или уберите фильтры.</p>
            <Link href="/catalog" className="btn mt-6 bg-ink text-white">Сбросить фильтры</Link>
          </div>
        )}
      </div>
    </div>
  );
}

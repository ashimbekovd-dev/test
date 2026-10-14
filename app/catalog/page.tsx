import type { Metadata } from "next";
import Link from "next/link";
import { CatalogFilters } from "@/components/CatalogFilters";
import { ProductGrid } from "@/components/ProductGrid";
import { catalogHref, getBrands, getCategories, normalize, parseCatalogQuery, queryCatalog } from "@/lib/catalog/query";
import { getProducts } from "@/lib/products/source";

export const revalidate = 300;

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { category } = parseCatalogQuery(await searchParams);
  return { title: category ?? "Каталог" };
}

const pluralProducts = (n: number) => {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "средство";
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "средства";
  return "средств";
};

export default async function CatalogPage({ searchParams }: Props) {
  const query = parseCatalogQuery(await searchParams);
  const products = await getProducts();
  const categories = getCategories(products);
  const brands = getBrands(products);
  const result = queryCatalog(products, query);
  const activeCategory = query.category
    ? categories.find((c) => normalize(c) === normalize(query.category!)) ?? query.category
    : undefined;

  return (
    <div className="container-page pt-8 md:pt-14">
      <h1 className="text-[2.6rem] md:text-[4rem]">{activeCategory ?? "Каталог"}</h1>
      <p className="mt-2 text-graphite-soft">
        {result.length} {pluralProducts(result.length)}
        {query.q ? ` по запросу «${query.q}»` : ""}
      </p>

      <nav aria-label="Категории" className="-mx-4 mt-6 overflow-x-auto px-4 md:mx-0 md:px-0">
        <ul className="flex w-max gap-2 md:w-auto md:flex-wrap">
          {[undefined, ...categories].map((c) => {
            const active = (c ? normalize(c) : undefined) === (query.category ? normalize(query.category) : undefined);
            return (
              <li key={c ?? "all"}>
                <Link
                  href={catalogHref({ ...query, category: c })}
                  aria-current={active ? "page" : undefined}
                  scroll={false}
                  className={`block whitespace-nowrap rounded-full border px-4 py-2 text-[14px] transition-colors ${
                    active ? "border-graphite bg-graphite text-milk" : "border-line hover:border-graphite"
                  }`}
                >
                  {c ?? "Все"}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-6">
        <CatalogFilters key={JSON.stringify(query)} query={query} brands={brands} />
      </div>

      <div className="mt-10">
        {result.length > 0 ? (
          <ProductGrid products={result} priorityCount={4} />
        ) : (
          <div className="rounded-[var(--radius-card)] bg-pad px-6 py-14 text-center">
            <h2 className="text-3xl">Ничего не нашли</h2>
            <p className="mx-auto mt-3 max-w-md text-graphite-soft">
              Попробуйте другое слово или уберите часть фильтров — или напишите нам в WhatsApp, подберём уход.
            </p>
            <Link href="/catalog" className="mt-6 inline-block rounded-full bg-graphite px-6 py-3 text-milk">
              Сбросить фильтры
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

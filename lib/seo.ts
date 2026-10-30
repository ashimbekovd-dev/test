import type { Product } from "@/lib/products/types";
import type { Review } from "@/lib/reviews";
import { averageRating } from "@/lib/reviews";
import { CONTACTS } from "@/lib/config";
import { displayName } from "@/lib/format";
import { absoluteUrl, SITE_URL } from "@/lib/site";

const abs = (src: string) => (src.startsWith("http") ? src : absoluteUrl(src));
const isoDate = (d: string) => d.split(".").reverse().join("-");

/** Первый абзац описания без разметки — для meta description и Google. */
export function shortDescription(p: Product, max = 160): string {
  const first = (p.description ?? "").split(/\n\s*\n/)[0]?.replace(/^#+\s*/gm, "").replace(/\s+/g, " ").trim() ?? "";
  const text = first || p.nameRu || displayName(p.name);
  return text.length > max ? `${text.slice(0, max - 1).replace(/\s+\S*$/, "")}…` : text;
}

/**
 * Разметка товара для Google: название, цена, наличие и — если есть отзывы именно
 * на это средство — рейтинг (звёзды в поиске). Отзывы на весь набор сюда не попадают.
 */
export function productJsonLd(p: Product, ownReviews: Review[] = []) {
  const url = absoluteUrl(`/product/${encodeURIComponent(p.sku)}`);
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: displayName(p.name),
    sku: p.sku,
    description: shortDescription(p, 500),
    image: p.images.map(abs),
    brand: { "@type": "Brand", name: p.brand.replace(/['’]$/, "") || "PIYOL" },
    url,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "KZT",
      price: p.price,
      availability: p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: "PIYOL'" },
    },
  };
  if (ownReviews.length) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: averageRating(ownReviews),
      reviewCount: ownReviews.length,
      bestRating: 5,
      worstRating: 1,
    };
    data.review = ownReviews.slice(0, 5).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      datePublished: isoDate(r.date),
      reviewBody: r.text,
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
    }));
  }
  return data;
}

/** Магазин: адрес, часы, телефоны, соцсети — для карточки в Google и 2ГИС. */
export function storeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: "PIYOL'",
    url: SITE_URL,
    logo: absoluteUrl("/logo-piyol.png"),
    image: absoluteUrl("/hero-hydra-moist.jpg"),
    description: "Корейская космецевтика PIYOL' — системный уход для улучшения качества кожи в домашних условиях.",
    telephone: CONTACTS.phones[0].replace(/\s/g, ""),
    email: CONTACTS.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACTS.pickupAddress,
      addressLocality: CONTACTS.city,
      addressCountry: "KZ",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "09:00",
        closes: "21:00",
      },
    ],
    sameAs: [CONTACTS.instagram, CONTACTS.telegram, CONTACTS.facebook],
  };
}

/** JSON для <script type="application/ld+json">: экранируем «<», чтобы текст отзывов не ломал страницу. */
export const ldJson = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");

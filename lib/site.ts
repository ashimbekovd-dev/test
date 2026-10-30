/**
 * Адрес сайта. После подключения домена достаточно задать в Vercel
 * переменную NEXT_PUBLIC_SITE_URL=https://piyolbeauty.kz — sitemap, превью ссылок
 * и разметка для Google обновятся сами.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://test-one-beta-67.vercel.app")
).replace(/\/+$/, "");

export const absoluteUrl = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

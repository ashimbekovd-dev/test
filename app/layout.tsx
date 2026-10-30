import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/cormorant";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { Analytics } from "@/components/Analytics";
import { SITE_URL } from "@/lib/site";
import { HOME_SEO } from "@/lib/seo-pages";

const isProduction = !process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production";

export const metadata: Metadata = {
  title: { default: HOME_SEO.title, template: "%s — PIYOL'" },
  description: HOME_SEO.description,
  // Тестовые копии сайта (preview) не должны попадать в поиск
  robots: isProduction ? { index: true, follow: true } : { index: false, follow: false },
  // Коды подтверждения Google Search Console, Яндекс Вебмастера и Facebook — те же, что на Tilda,
  // чтобы после переезда права на сайт в этих сервисах сохранились
  verification: {
    google: ["6Nfq1ECjh-z_LQDkg3maISRRiMNo_t5tbKe5SN2TpJQ", "v_v3D7d-MWVmhsoM9snZl6aoOxH5SLrB8h0zL1P11Bg"],
    yandex: "279c9cd19deec908",
    other: { "facebook-domain-verification": "7bhgakwcdog9qxnd8fgwgjswapv52c" },
  },
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "PIYOL'",
    title: "PIYOL' — системный уход, научный подход",
    description: HOME_SEO.description,
    images: [{ url: "/hero-hydra-moist.jpg", width: 1600, height: 2400, alt: "Линия PIYOL' Active Hydra-Moist" }],
  },
};

export const viewport: Viewport = { themeColor: "#fbf7f4" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <CartProvider>
          <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:p-2">
            Перейти к содержимому
          </a>
          <Header />
          <main id="main" className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFab />
          <Analytics />
        </CartProvider>
      </body>
    </html>
  );
}

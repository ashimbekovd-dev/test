import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/cormorant";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { default: "PIYOL' — корейская косметика в Алматы", template: "%s — PIYOL'" },
  description: "Каталог корейской косметики PIYOL'. Заказ в WhatsApp, самовывоз из магазина в Алматы.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "PIYOL'",
    title: "PIYOL' — системный уход, научный подход",
    description: "Корейская космецевтика PIYOL'. Подбор ухода, заказ в WhatsApp, самовывоз в Алматы и доставка по Казахстану.",
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
        </CartProvider>
      </body>
    </html>
  );
}

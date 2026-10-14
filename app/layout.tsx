import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WhatsAppFab } from "@/components/WhatsAppFab";

export const metadata: Metadata = {
  title: { default: "PIYOL' — корейская косметика в Алматы", template: "%s — PIYOL'" },
  description:
    "Уход, в который можно влюбиться. Корейская косметика и космецевтика PIYOL' в ТРЦ Forum Almaty, доставка по Казахстану.",
};

export const viewport: Viewport = { themeColor: "#f8f4ef" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body className="flex min-h-dvh flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFab />
        </CartProvider>
      </body>
    </html>
  );
}

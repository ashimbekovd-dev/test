import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/cormorant";
import "@fontsource-variable/cormorant/wght-italic.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "PIYOL' — корейская косметика в Алматы",
  description: "Каталог корейской косметики PIYOL'. Заказ в WhatsApp, самовывоз из ТРЦ Forum Almaty.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "PIYOL' — корейская косметика в Алматы",
  description: "Уход, в который можно влюбиться. Корейская косметика и космецевтика PIYOL' в ТРЦ Forum Almaty.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}

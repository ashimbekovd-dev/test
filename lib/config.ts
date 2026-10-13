export const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP ?? "77080503518").replace(/\D/g, "");

export const CONTACTS = {
  storeName: "PIYOL'",
  address: "ТРЦ Forum Almaty, 2 этаж",
  city: "Алматы",
  hours: "ежедневно 10:00–22:00",
  phones: [
    { label: "Магазин", value: "+7 708 050 35 18", href: "tel:+77080503518" },
    { label: "Оплата и сайт", value: "+7 771 980 00 77", href: "tel:+77719800077" },
    { label: "Возврат", value: "+7 747 806 39 11", href: "tel:+77478063911" },
  ],
  email: "piyolbeauty@gmail.com",
  instagram: "https://instagram.com/piyol.space",
  telegram: "https://t.me/piyolspace",
  facebook: "https://www.facebook.com/piyol.space",
  map2gis: "https://2gis.kz/almaty/search/%D0%A2%D0%A0%D0%A6%20Forum%20Almaty",
  googleMaps: "https://www.google.com/maps/search/?api=1&query=Forum+Almaty",
} as const;

export const SLOGAN = "Уход, в который можно влюбиться";

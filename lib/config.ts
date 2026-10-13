export const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP ?? "77080503518").replace(/\D/g, "");

export const CONTACTS = {
  storeName: "PIYOL'",
  pickupAddress: "ТРЦ Forum Almaty, 2 этаж",
  city: "Алматы",
  hours: "ежедневно 10:00–22:00",
  phones: ["+7 708 050 35 18", "+7 708 050 25 18", "+7 771 980 00 77"],
  whatsappDisplay: "+7 708 050 35 18",
  email: "piyolbeauty@gmail.com",
  instagram: "https://www.instagram.com/piyolbeauty.kz/",
  telegram: "https://t.me/piyolbeauty",
  mapUrl: "https://2gis.kz/almaty/search/Forum%20Almaty",
} as const;

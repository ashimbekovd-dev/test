export const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP ?? "77080503518").replace(/\D/g, "");

export const CONTACTS = {
  storeName: "PIYOL'",
  pickupAddress: "ул. Жандосова, 310г (мкр Таугуль-3)",
  city: "Алматы",
  hours: "ежедневно с 9:00 до 21:00",
  phones: ["+7 708 050 35 18", "+7 708 050 25 18"],
  paymentPhone: "+7 771 980 00 77",
  returnsWhatsapp: "+7 747 806 39 11",
  whatsappDisplay: "+7 708 050 35 18",
  email: "piyolbeauty@gmail.com",
  instagram: "https://instagram.com/piyol.space",
  telegram: "https://t.me/piyolspace",
  facebook: "https://www.facebook.com/piyol.space",
  mapUrl: "https://go.2gis.com/02AH9",
} as const;

/** Стоимость доставки «от», ₸. Меняется здесь — обновится в корзине, на главной и на странице доставки. */
export const DELIVERY_FROM = { almaty: 2700, kazakhstan: 2700 } as const;

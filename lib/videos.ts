/**
 * Видео «Как применять» для карточек товаров.
 *
 * Как добавить видео:
 * • файл .mp4 (вертикальный 9:16) положить в public/videos/ вместе с обложкой <имя>.jpg и указать путь: "/videos/<имя>.mp4";
 * • или ссылку на YouTube / YouTube Shorts.
 * Если видео общее для нескольких средств (например, как открыть флакон с пипеткой) — укажите один и тот же путь.
 */

export type HowToVideo =
  | { kind: "file"; src: string; poster?: string }
  | { kind: "youtube"; id: string };

/** Артикул → видео (путь к .mp4 или ссылка на YouTube) */
export const VIDEOS: Record<string, string> = {
  "ACTIVE-HYDRA-MOIST-TONER": "/videos/active-hydra-moist-toner.mp4",
  "ACTIVE-HYDRA-MOIST-SERUM": "/videos/active-hydra-moist-serum.mp4",
  "ACTIVE-HYDRA-MOIST-EMULSION": "/videos/active-hydra-moist-emulsion.mp4",
  "ACTIVE-HYDRA-MOIST-WRINKLE-EYE-CARE-CREAM": "/videos/active-hydra-moist-eye-cream.mp4",
  "BIO-CELL-EXTRA-COLLAGEN-TONER": "/videos/bio-cell-extra-collagen-toner.mp4",
  "BIO-CELL-EXTRA-COLLAGEN-LIPO-EXOSOME-AMPOULE": "/videos/bio-cell-extra-collagen-lipo-exosome-ampoule.mp4",
  "BIO-CELL-EXTRA-COLLAGEN-HYDRATING-EMULSION": "/videos/bio-cell-extra-collagen-emulsion.mp4",
  "BIO-CELL-EXTRA-COLLAGEN-BOOSTER-CREAM": "/videos/bio-cell-extra-collagen-booster-cream.mp4",
  "INTENSE-PURIFYING-ACNE-FOAM": "/videos/intense-purifying-acne-foam.mp4",
  "INTENSE-PURIFYING-ACNE-TONER": "/videos/intense-purifying-acne-toner.mp4",
  "INTENSE-PURIFYING-ACNE-SERUM": "/videos/intense-purifying-acne-serum.mp4",
  "PAPAYA-CLEANSING-ENZYME-POWDER": "/videos/papaya-enzyme-powder.mp4",
};

export function parseVideo(value?: string): HowToVideo | undefined {
  const v = value?.trim();
  if (!v) return undefined;
  const yt = v.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return { kind: "youtube", id: yt[1] };
  // Свой файл: обложка — кадр с тем же именем .jpg рядом с видео
  if (/^\/[\w\-/.]+\.(mp4|webm|mov)$/i.test(v)) return { kind: "file", src: v, poster: v.replace(/\.\w+$/, ".jpg") };
  if (/^https:\/\/\S+\.(mp4|webm|mov)(\?\S*)?$/i.test(v)) return { kind: "file", src: v };
  return undefined;
}

export const videoFor = (sku: string, map: Record<string, string> = VIDEOS) => parseVideo(map[sku]);

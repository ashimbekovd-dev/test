/**
 * Видео «Как применять» для карточек товаров.
 *
 * Как добавить видео:
 * • файл .mp4 (лучше вертикальный 9:16, до 10 МБ) положить в public/videos/ и указать путь: "/videos/<имя>.mp4";
 * • или ссылку на YouTube / YouTube Shorts.
 * Если видео общее для нескольких средств (например, как открыть флакон с пипеткой) — укажите один и тот же путь.
 */

export type HowToVideo =
  | { kind: "file"; src: string; poster?: string }
  | { kind: "youtube"; id: string };

/** Артикул → видео (путь к .mp4 или ссылка на YouTube) */
export const VIDEOS: Record<string, string> = {};

export function parseVideo(value?: string): HowToVideo | undefined {
  const v = value?.trim();
  if (!v) return undefined;
  const yt = v.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return { kind: "youtube", id: yt[1] };
  if (/^\/[\w\-/.]+\.(mp4|webm|mov)$/i.test(v) || /^https:\/\/\S+\.(mp4|webm|mov)(\?\S*)?$/i.test(v)) return { kind: "file", src: v };
  return undefined;
}

export const videoFor = (sku: string, map: Record<string, string> = VIDEOS) => parseVideo(map[sku]);

import type { HowToVideo as Video } from "@/lib/videos";

/** Вертикальное видео «Как применять». Не грузится, пока его не включат (preload="none"). */
export function HowToVideo({ video, title, poster }: { video: Video; title: string; poster?: string }) {
  return (
    <figure className="mt-5 w-full max-w-[320px]">
      <div className="relative aspect-[9/16] overflow-hidden rounded-[24px] bg-petal/60">
        {video.kind === "youtube" ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0&playsinline=1`}
            title={`Как применять: ${title}`}
            loading="lazy"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            className="absolute inset-0 size-full"
          />
        ) : (
          <video
            controls
            playsInline
            preload="none"
            poster={video.poster ?? poster}
            className="absolute inset-0 size-full object-cover"
            aria-label={`Как применять: ${title}`}
          >
            <source src={video.src} />
          </video>
        )}
      </div>
      <figcaption className="mt-2 text-[13px] text-mute">Видео: как применять {title}</figcaption>
    </figure>
  );
}

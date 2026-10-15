import { parseRichText } from "@/lib/richtext";

export function RichText({ text, className = "" }: { text?: string; className?: string }) {
  const blocks = parseRichText(text);
  if (!blocks.length) return null;
  return (
    <div className={`space-y-3 text-[15px] leading-relaxed ${className}`}>
      {blocks.map((b, i) => {
        if (b.kind === "h") return <h3 key={i} className="pt-3 font-display text-[22px] leading-tight">{b.text}</h3>;
        if (b.kind === "ul")
          return (
            <ul key={i} className="space-y-1.5">
              {b.items.map((t, j) => (
                <li key={j} className="flex gap-2.5"><span aria-hidden className="text-rose">✦</span><span>{t}</span></li>
              ))}
            </ul>
          );
        if (b.kind === "ol")
          return (
            <ol key={i} className="space-y-2">
              {b.items.map((t, j) => (
                <li key={j} className="flex gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-petal text-[12px] font-semibold">{j + 1}</span>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
          );
        return (
          <p key={i}>
            {b.lines.map((l, j) => (
              <span key={j}>{j > 0 && <br />}{l}</span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

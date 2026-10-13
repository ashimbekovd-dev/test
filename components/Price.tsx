import { formatPrice } from "@/lib/format";

export function Price({ price, oldPrice, size = "md" }: { price: number; oldPrice?: number; size?: "md" | "lg" }) {
  const big = size === "lg";
  return (
    <p className={`flex flex-wrap items-baseline gap-x-2 ${big ? "text-2xl" : "text-[15px]"}`}>
      <span className={`font-semibold ${oldPrice ? "text-rose" : ""}`}>{formatPrice(price)}</span>
      {oldPrice && (
        <>
          <s className={`text-mute ${big ? "text-base" : "text-[13px]"}`}>{formatPrice(oldPrice)}</s>
          <span className="sr-only">Скидка {Math.round((1 - price / oldPrice) * 100)}%</span>
        </>
      )}
    </p>
  );
}

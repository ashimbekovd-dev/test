import { formatPrice } from "@/lib/format";

type Props = { price: number; oldPrice?: number; size?: "sm" | "lg" };

export function Price({ price, oldPrice, size = "sm" }: Props) {
  const discount = oldPrice ? Math.round((1 - price / oldPrice) * 100) : 0;
  return (
    <p className={`flex flex-wrap items-baseline gap-x-2 ${size === "lg" ? "text-2xl" : "text-[15px]"}`}>
      <span className={`font-semibold tabular-nums ${oldPrice ? "text-powder-deep" : ""}`}>{formatPrice(price)}</span>
      {oldPrice && (
        <>
          <s className="text-graphite-soft tabular-nums">
            <span className="sr-only">Было </span>
            {formatPrice(oldPrice)}
          </s>
          {discount > 0 && <span className="text-[13px] text-powder-deep">−{discount}%</span>}
        </>
      )}
    </p>
  );
}

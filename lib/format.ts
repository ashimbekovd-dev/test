const NBSP = " ";

/** 13490 → "13 490 ₸" (non-breaking spaces; independent of ICU locale data). */
export function formatPrice(value: number): string {
  const digits = String(Math.round(Math.abs(value)));
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
  return `${value < 0 ? "-" : ""}${grouped}${NBSP}₸`;
}

const NBSP = " ";

/** 13490 → "13 490 ₸" (non-breaking spaces; independent of ICU locale data). */
export function formatPrice(value: number): string {
  const digits = String(Math.round(Math.abs(value)));
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
  return `${value < 0 ? "-" : ""}${grouped}${NBSP}₸`;
}

/** "PIYOL' Active Hydra-Moist Serum" → "Active Hydra-Moist Serum" (the brand is shown separately). */
export function displayName(name: string): string {
  return name.replace(/^PIYOL['’]\s*/i, "").trim() || name;
}

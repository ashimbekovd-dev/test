const NBSP = " ";

/** 13490 → "13 490 ₸" (неразрывные пробелы). Без Intl, чтобы вывод не зависел от ICU. */
export function formatPrice(value: number): string {
  const rounded = Math.round(value);
  const sign = rounded < 0 ? "-" : "";
  const digits = String(Math.abs(rounded));
  let grouped = "";
  for (let i = 0; i < digits.length; i++) {
    const fromEnd = digits.length - i;
    grouped += digits[i];
    if (fromEnd > 1 && (fromEnd - 1) % 3 === 0) grouped += NBSP;
  }
  return `${sign}${grouped}${NBSP}₸`;
}

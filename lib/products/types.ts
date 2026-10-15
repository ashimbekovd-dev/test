export type Product = {
  sku: string;
  name: string;
  nameRu?: string;
  brand: string;
  category: string;
  price: number;
  oldPrice?: number;
  volume?: string;
  description?: string;
  howToUse?: string;
  images: string[];
  hit: boolean;
  inStock: boolean;
  /** задачи кожи (slug'и из lib/concerns) */
  concerns: string[];
  /** slug линии ухода из lib/lines */
  line?: string;
};

export type ParseError = { row: number; reason: string };
export type ParseResult = { products: Product[]; errors: ParseError[] };

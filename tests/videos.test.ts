import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { parseVideo, VIDEOS, videoFor } from "@/lib/videos";
import { parseProductsCsv } from "@/lib/products/parse";

const { products } = parseProductsCsv(readFileSync(path.join(process.cwd(), "data/products.csv"), "utf8"));

describe("how-to videos", () => {
  it("понимает файлы и ссылки YouTube, остальное игнорирует", () => {
    expect(parseVideo("/videos/serum.mp4")).toEqual({ kind: "file", src: "/videos/serum.mp4", poster: "/videos/serum.jpg" });
    expect(parseVideo("https://cdn.example.com/a.mp4")).toEqual({ kind: "file", src: "https://cdn.example.com/a.mp4" });
    expect(parseVideo("https://youtube.com/shorts/abcdefghijk")).toEqual({ kind: "youtube", id: "abcdefghijk" });
    expect(parseVideo("https://www.youtube.com/watch?v=abcdefghijk&t=3")).toEqual({ kind: "youtube", id: "abcdefghijk" });
    expect(parseVideo("https://youtu.be/abcdefghijk")).toEqual({ kind: "youtube", id: "abcdefghijk" });
    expect(parseVideo("https://instagram.com/reel/xyz")).toBeUndefined();
    expect(parseVideo("")).toBeUndefined();
    expect(videoFor("X", { X: "/videos/x.mp4" })?.kind).toBe("file");
  });
  it("все видео привязаны к существующим товарам, файлы на месте", () => {
    for (const [sku, v] of Object.entries(VIDEOS)) {
      expect(products.some((p) => p.sku === sku), sku).toBe(true);
      const parsed = parseVideo(v);
      expect(parsed, v).toBeDefined();
      if (parsed?.kind === "file" && parsed.src.startsWith("/")) {
        expect(existsSync(path.join(process.cwd(), "public", parsed.src)), v).toBe(true);
        expect(existsSync(path.join(process.cwd(), "public", parsed.poster!)), parsed.poster).toBe(true);
      }
    }
  });
});

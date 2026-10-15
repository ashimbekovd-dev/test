/** Факты, которые снимают сомнения перед покупкой (формулировки согласованы с владелицей бренда). */
const FACTS = [
  { title: "Производство в Южной Корее", text: "Формулы PIYOL’ выпускают корейские заводы космецевтики." },
  { title: "Консультация в WhatsApp", text: "Поможем подобрать уход, ежедневно с 9:00 до 21:00." },
  { title: "Самовывоз и доставка", text: "Бесплатно из магазина в Алматы, доставка по всему Казахстану." },
  { title: "10 000+ реальных кейсов", text: "Результаты клиенток до и после ухода PIYOL’." },
];

export function TrustStrip({ compact = false }: { compact?: boolean }) {
  return (
    <ul className={`grid gap-x-6 gap-y-4 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4"}`}>
      {FACTS.map((f) => (
        <li key={f.title} className="flex gap-3">
          <span aria-hidden className="mt-0.5 text-rose">✦</span>
          <span>
            <span className="block text-[15px] font-semibold">{f.title}</span>
            <span className="block text-[14px] text-mute">{f.text}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

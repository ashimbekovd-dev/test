export function InfoPage({ title, lead, children }: { title: string; lead?: string; children: React.ReactNode }) {
  return (
    <div className="container-page pt-8 md:pt-14">
      <h1 className="max-w-[16ch] text-[2.6rem] md:text-[4.2rem]">{title}</h1>
      {lead && <p className="mt-4 max-w-[52ch] text-[17px] text-graphite-soft md:text-lg">{lead}</p>}
      <div className="mt-10 grid gap-x-16 gap-y-10 md:mt-14 md:grid-cols-2">{children}</div>
    </div>
  );
}

export function InfoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="max-w-prose border-t border-line pt-6">
      <h2 className="text-[1.9rem] md:text-[2.2rem]">{title}</h2>
      <div className="mt-3 space-y-3 text-[16px] [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-1.5">{children}</div>
    </section>
  );
}

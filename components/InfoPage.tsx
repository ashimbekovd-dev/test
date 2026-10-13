export function InfoPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="wrap pt-8 md:pt-12">
      <h1 className="text-[44px] md:text-[64px]">{title}</h1>
      <div className="mt-8 max-w-[68ch] space-y-10 text-[16px] [&_h2]:text-3xl [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
        {children}
      </div>
    </div>
  );
}

"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { analyticsEnabledFor, FB_PIXEL_ID, METRIKA_ID, track } from "@/lib/analytics";

type W = Window & { ym?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void };

/** Просмотры страниц при переходах внутри сайта (без перезагрузки). */
function PageViews() {
  const pathname = usePathname();
  const search = useSearchParams();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const w = window as W;
    w.ym?.(METRIKA_ID, "hit", window.location.href, { referer: document.referrer });
    w.fbq?.("track", "PageView");
  }, [pathname, search]);
  return null;
}

export function Analytics() {
  const [on, setOn] = useState(false);
  useEffect(() => setOn(analyticsEnabledFor(window.location.hostname)), []);

  // Любой клик по ссылке WhatsApp — цель «Написали в WhatsApp»
  useEffect(() => {
    if (!on) return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a[href*='wa.me']");
      if (a) track("whatsapp_click");
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [on]);

  if (!on) return null;
  return (
    <>
      <Script id="ym" strategy="afterInteractive">{`
(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
ym(${METRIKA_ID}, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true });
`}</Script>
      <Script id="fb-pixel" strategy="afterInteractive">{`
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${FB_PIXEL_ID}'); fbq('track', 'PageView');
`}</Script>
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://mc.yandex.ru/watch/${METRIKA_ID}`} style={{ position: "absolute", left: "-9999px" }} alt="" />
        </div>
      </noscript>
      <Suspense fallback={null}>
        <PageViews />
      </Suspense>
    </>
  );
}

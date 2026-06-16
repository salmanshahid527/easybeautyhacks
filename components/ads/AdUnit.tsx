"use client";

import Script from "next/script";

const AD_UNITS = {
  nativeBanner: {
    type: "invoke",
    src: process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_SRC ?? "",
    containerId: process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_ID ?? "",
  },
  banner300x250: {
    type: "atOptions",
    id: "adsterra-medium",
    key: process.env.NEXT_PUBLIC_ADSTERRA_MEDIUM_KEY ?? "",
    height: 250,
    width: 300,
    src: process.env.NEXT_PUBLIC_ADSTERRA_MEDIUM_SRC ?? "",
  },
  banner320x50: {
    type: "atOptions",
    id: "adsterra-mobile",
    key: process.env.NEXT_PUBLIC_ADSTERRA_MOBILE_KEY ?? "",
    height: 50,
    width: 320,
    src: process.env.NEXT_PUBLIC_ADSTERRA_MOBILE_SRC ?? "",
  },
  banner728x90: {
    type: "atOptions",
    id: "adsterra-leader",
    key: process.env.NEXT_PUBLIC_ADSTERRA_LEADER_KEY ?? "",
    height: 90,
    width: 728,
    src: process.env.NEXT_PUBLIC_ADSTERRA_LEADER_SRC ?? "",
  },
} as const;

export type AdUnitKey = keyof typeof AD_UNITS;

interface AdUnitProps {
  unit: AdUnitKey;
  className?: string;
}

export function AdUnit({ unit, className = "" }: AdUnitProps) {
  const ad = AD_UNITS[unit];

  const isProduction = process.env.NODE_ENV === "production";
  const isRealAdSrc = !!ad.src;
  const isRealAdKey = ad.type === "atOptions" && !!ad.key;
  const shouldRenderAd =
    isProduction && isRealAdSrc && (ad.type === "invoke" || isRealAdKey);

  if (!shouldRenderAd) return null;

  const defaultClass =
    unit === "banner728x90"
      ? "hidden md:flex"
      : unit === "banner320x50"
      ? "flex md:hidden"
      : "flex";

  return (
    <div className={`my-4 w-full justify-center ${defaultClass} ${className}`}>
      {ad.type === "invoke" ? (
        <>
          <Script
            async
            data-cfasync="false"
            src={ad.src}
            strategy="afterInteractive"
          />
          <div id={ad.containerId} />
        </>
      ) : (
        <>
          <Script id={ad.id} strategy="afterInteractive">
            {`atOptions = { 'key': '${ad.key}', 'format': 'iframe', 'height': ${ad.height}, 'width': ${ad.width}, 'params': {} };`}
          </Script>
          <Script src={ad.src} strategy="afterInteractive" />
        </>
      )}
    </div>
  );
}
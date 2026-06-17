"use client";

import Script from "next/script";
import {
  getBannerScriptUrl,
  getNativeBannerContainerId,
  getNativeBannerScriptUrl,
} from "@/lib/adsterra";

function getAdUnitConfig() {
  const nativeKey = process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_KEY ?? "";
  const mediumKey = process.env.NEXT_PUBLIC_ADSTERRA_MEDIUM_KEY ?? "";
  const mobileKey = process.env.NEXT_PUBLIC_ADSTERRA_MOBILE_KEY ?? "";
  const leaderKey = process.env.NEXT_PUBLIC_ADSTERRA_LEADER_KEY ?? "";

  return {
    nativeBanner: {
      type: "invoke" as const,
      src: getNativeBannerScriptUrl(nativeKey),
      containerId: getNativeBannerContainerId(nativeKey),
    },
    banner300x250: {
      type: "atOptions" as const,
      id: "adsterra-medium",
      key: mediumKey,
      height: 250,
      width: 300,
      src: getBannerScriptUrl(mediumKey),
    },
    banner320x50: {
      type: "atOptions" as const,
      id: "adsterra-mobile",
      key: mobileKey,
      height: 50,
      width: 320,
      src: getBannerScriptUrl(mobileKey),
    },
    banner728x90: {
      type: "atOptions" as const,
      id: "adsterra-leader",
      key: leaderKey,
      height: 90,
      width: 728,
      src: getBannerScriptUrl(leaderKey),
    },
  };
}

export type AdUnitKey = keyof ReturnType<typeof getAdUnitConfig>;

interface AdUnitProps {
  unit: AdUnitKey;
  className?: string;
}

export function AdUnit({ unit, className = "" }: AdUnitProps) {
  const ad = getAdUnitConfig()[unit];

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

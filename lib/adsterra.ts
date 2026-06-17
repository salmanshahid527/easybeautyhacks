const SOCIAL_BAR_HOST = "pl29744033.effectivecpmnetwork.com";
const NATIVE_BANNER_HOST = "pl29744034.effectivecpmnetwork.com";
const BANNER_HOST = "www.highperformanceformat.com";

export function getSocialBarScriptUrl(key: string): string {
  if (!key) return "";
  const path = `${key.slice(0, 2)}/${key.slice(2, 4)}/${key.slice(4, 6)}`;
  return `https://${SOCIAL_BAR_HOST}/${path}/${key}.js`;
}

export function getNativeBannerScriptUrl(key: string): string {
  if (!key) return "";
  return `https://${NATIVE_BANNER_HOST}/${key}/invoke.js`;
}

export function getNativeBannerContainerId(key: string): string {
  return key ? `container-${key}` : "";
}

export function getBannerScriptUrl(key: string): string {
  if (!key) return "";
  return `https://${BANNER_HOST}/${key}/invoke.js`;
}

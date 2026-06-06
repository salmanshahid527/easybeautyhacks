"use client";

import { useEffect, useState } from "react";

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");

    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
      <div className="mx-auto max-w-5xl rounded-3xl border border-pink-200 bg-gradient-to-r from-pink-50 via-white to-rose-50 p-5 shadow-[0_10px_40px_rgba(244,114,182,0.18)]">
        
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          
          <div className="max-w-3xl">
            <h3 className="text-lg font-semibold text-pink-700">
              We use cookies
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Easybeautyhacks use cookies to improve your experience, personalize content,
              and analyze website traffic. By clicking “Accept”, you agree to
              our use of cookies.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={declineCookies}
              className="rounded-xl border border-pink-300 bg-white px-5 py-2.5 text-sm font-medium text-pink-600 transition hover:bg-pink-50"
            >
              Decline
            </button>

            <button
              onClick={acceptCookies}
              className="rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:scale-105 hover:from-pink-600 hover:to-rose-600"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
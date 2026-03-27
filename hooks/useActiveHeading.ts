"use client";

import { useEffect, useState } from "react";

export function useActiveHeading(headingIds: string[]) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!headingIds.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "0% 0% -70% 0%", threshold: 0 }
    );

    for (const id of headingIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headingIds]);

  return activeId;
}

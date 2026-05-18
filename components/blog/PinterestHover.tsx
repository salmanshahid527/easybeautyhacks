"use client";

import { useEffect } from "react";

interface PinterestHoverProps {
  targetContainerClass: string;
}

export default function PinterestHover({ targetContainerClass }: PinterestHoverProps) {
  useEffect(() => {
    // Function to apply pin button to images
    const applyPinterestOverlay = () => {
      const container = document.querySelector(`.${targetContainerClass}`);
      if (!container) return;

      const images = container.querySelectorAll("img");

      images.forEach((img) => {
        // Skip if image is hidden or already wrapped
        if (img.parentElement?.classList.contains("group") || img.closest('.opacity-0')) return;

        // Parent wrapper
        const wrapper = document.createElement("div");
        wrapper.className = "relative group inline-block w-full";

        const overlayDiv = document.createElement("div");
        overlayDiv.className = "absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity z-10";
        
        const pinBtn = document.createElement("button");
        pinBtn.className = "bg-red-600 text-white p-2 rounded-full shadow-md flex items-center justify-center hover:bg-red-700 transition-colors pointer-events-auto";
        
        pinBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.372 0 0 5.373 0 12c0 5.084 3.163 9.406 7.622 11.095-.105-.945-.2-2.395.042-3.429.218-.936 1.404-5.964 1.404-5.964s-.358-.716-.358-1.775c0-1.662.964-2.902 2.165-2.902 1.02 0 1.512.767 1.512 1.684 0 1.026-.654 2.558-.99 3.981-.283 1.196.602 2.17 1.784 2.17 2.14 0 3.786-2.257 3.786-5.516 0-2.878-2.066-4.886-5.019-4.886-3.426 0-5.44 2.568-5.44 5.224 0 1.034.397 2.145.893 2.747.098.119.112.223.083.344-.09.374-.293 1.193-.331 1.361-.052.22-.17.268-.396.162-1.482-.687-2.406-2.843-2.406-4.58 0-3.731 2.71-7.159 7.814-7.159 4.096 0 7.281 2.92 7.281 6.811 0 4.063-2.561 7.337-6.11 7.337-1.194 0-2.316-.62-2.7-1.352l-.735 2.805c-.265 1.012-.985 2.283-1.467 3.057C9.72 23.947 10.847 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
          </svg>
        `;

        pinBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          window.open("https://www.pinterest.com/easybeautyhack", "_blank");
        };

        overlayDiv.appendChild(pinBtn);

        img.parentNode?.insertBefore(wrapper, img);
        wrapper.appendChild(img);
        wrapper.appendChild(overlayDiv);
      });
    };

    // Initial run
    applyPinterestOverlay();

    // Watch for dynamic content changes (WordPress API delay solution)
    const observer = new MutationObserver(() => {
      applyPinterestOverlay();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [targetContainerClass]);

  return null;
}
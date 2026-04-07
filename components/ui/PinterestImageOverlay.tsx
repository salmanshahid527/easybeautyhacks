'use client';

import { ReactNode } from 'react';
import { FaPinterest } from 'react-icons/fa';

interface PinterestImageOverlayProps {
  children: ReactNode;
  pinterestUrl?: string;
  className?: string;
}

export function PinterestImageOverlay({
  children,
  pinterestUrl = 'https://pinterest.com/easybeautyhacks',
  className = '',
}: PinterestImageOverlayProps) {
  return (
    <div className={`relative group ${className}`}>
      {children}
      <a
        href={pinterestUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        aria-label="Share on Pinterest"
        className={`
          absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4
          w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12
          bg-[#E60023] hover:bg-[#C41E14]
          rounded-full
          flex items-center justify-center
          shadow-lg hover:shadow-2xl
          transition-all duration-300 ease-out
          opacity-0 sm:group-hover:opacity-100
          md:group-hover:opacity-100
          lg:opacity-100
          z-20
          pointer-events-auto
          active:scale-95
          ring-2 ring-white/20 hover:ring-white/40
        `}
      >
        <FaPinterest className="w-5 h-5 text-white" />
      </a>
    </div>
  );
}

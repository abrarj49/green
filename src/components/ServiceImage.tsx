'use client';

import { useState } from 'react';

interface ServiceImageProps {
  src?: string | null;
  alt: string;
  isAr?: boolean;
  className?: string;
  containerClassName?: string;
  compact?: boolean;
}

export default function ServiceImage({
  src,
  alt,
  isAr = false,
  className = 'w-full h-full object-cover transition-transform duration-700 group-hover:scale-110',
  containerClassName = 'w-full h-full relative overflow-hidden bg-[#181A22]',
  compact = false,
}: ServiceImageProps) {
  const [hasError, setHasError] = useState(false);

  const isMissing =
    !src ||
    src.trim() === '' ||
    src.toLowerCase() === 'no-image' ||
    src.toLowerCase() === 'none' ||
    src.toLowerCase() === 'null' ||
    hasError;

  if (isMissing) {
    if (compact) {
      return (
        <div
          className={`${containerClassName} flex flex-col items-center justify-center p-2 text-center select-none border border-neutral-800 bg-[#161822] text-neutral-400`}
          role="img"
          aria-label={isAr ? 'لا توجد صورة' : 'No image'}
          title={isAr ? 'لا توجد صورة' : 'No image'}
        >
          <svg className="w-5 h-5 stroke-[1.5] text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
            <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="1.75" />
          </svg>
          <span className="text-[9px] uppercase tracking-wider font-bold text-neutral-500 mt-1 line-clamp-1">
            {isAr ? 'بدون صورة' : 'No Photo'}
          </span>
        </div>
      );
    }
    return (
      <div
        className={`${containerClassName} flex flex-col items-center justify-center p-6 text-center select-none border border-neutral-800 bg-[#161822] group-hover:bg-[#1C1F2B] transition-colors`}
        role="img"
        aria-label={isAr ? 'لا توجد صورة متوفرة' : 'No image available'}
      >
        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 mb-2.5 transition-transform duration-300 group-hover:scale-110 group-hover:border-[#1D8F2C]/50 group-hover:text-[#1D8F2C]">
          <svg className="w-6 h-6 stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
            <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="1.75" />
          </svg>
        </div>
        <span className="text-xs uppercase tracking-wider font-extrabold text-neutral-400 font-[var(--font-display)] group-hover:text-neutral-200 transition-colors">
          {isAr ? 'لا توجد صورة' : 'No Image Available'}
        </span>
        <span className="text-[10px] text-neutral-500 mt-1 font-medium">
          {isAr ? 'لم يتم إرفاق صورة لهذه الخدمة' : 'No photo uploaded'}
        </span>
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      <img
        src={src}
        alt={alt}
        onError={() => setHasError(true)}
        className={className}
        loading="lazy"
      />
    </div>
  );
}

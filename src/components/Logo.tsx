import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'header' | 'footer' | 'mark' | 'white';
  className?: string;
  showSubtitle?: boolean;
}

export default function Logo({
  variant = 'header',
  className = '',
  showSubtitle = true,
}: LogoProps) {
  const isWhite = variant === 'white';

  if (variant === 'mark') {
    return (
      <Link href="/" className={`inline-block group ${className}`} aria-label="Dr. Megha Bobde's Homoeo Clinic">
        <img
          src="/images/logo.png"
          alt="Dr. Megha Bobde Clinic Swirl Logo"
          className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
    );
  }

  if (variant === 'footer') {
    return (
      <Link href="/" className={`inline-flex flex-col items-center group text-center ${className}`}>
        <div className="relative mb-3">
          <img
            src="/images/logo.png"
            alt="Dr. Megha Bobde Clinic Logo"
            className={`w-16 h-16 object-contain transition-transform duration-300 group-hover:scale-105 ${
              isWhite ? 'brightness-0 invert' : ''
            }`}
          />
        </div>
        <span className={`font-serif text-xl sm:text-2xl font-bold tracking-tight ${
          isWhite ? 'text-white' : 'text-espresso-900'
        }`}>
          Dr. Megha Bobde's Homoeo Clinic
        </span>
        {showSubtitle && (
          <span className={`font-devanagari text-xs sm:text-sm mt-1 tracking-wide ${
            isWhite ? 'text-cream-200/80' : 'text-brand-700'
          }`}>
            डॉ. मेघा बोबडे 'स होम्यो क्लिनिक
          </span>
        )}
      </Link>
    );
  }

  // Default 'header' lockup
  return (
    <Link href="/" className={`flex items-center gap-3 group shrink-0 ${className}`}>
      <div className="relative w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center shrink-0">
        <img
          src="/images/logo.png"
          alt="Dr. Megha Bobde Clinic Logo"
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col">
        <span className="font-serif font-bold text-base sm:text-lg text-espresso-900 tracking-tight leading-tight group-hover:text-brand-600 transition-colors">
          Dr. Megha Bobde<span className="text-brand-500 font-sans font-normal">'s</span>
        </span>
        <span className="font-sans text-[11px] sm:text-xs text-espresso-600 font-medium tracking-wide uppercase">
          Homoeo Clinic
        </span>
        {showSubtitle && (
          <span className="font-devanagari text-[10px] text-brand-700 font-medium tracking-tight mt-0.5 hidden xs:block">
            डॉ. मेघा बोबडे 'स होम्यो क्लिनिक
          </span>
        )}
      </div>
    </Link>
  );
}
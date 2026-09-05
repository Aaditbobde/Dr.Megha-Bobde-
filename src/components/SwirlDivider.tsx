import React from 'react';

interface SwirlDividerProps {
  className?: string;
  flip?: boolean;
}

export default function SwirlDivider({ className = '', flip = false }: SwirlDividerProps) {
  return (
    <div
      className={`w-full flex items-center justify-center overflow-hidden py-4 text-brand-300/70 select-none pointer-events-none ${className} ${
        flip ? 'rotate-180' : ''
      }`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1200 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-4xl h-7 stroke-current"
      >
        <path
          d="M0 20 C 300 20, 350 35, 450 35 C 550 35, 570 5, 600 5 C 630 5, 650 35, 750 35 C 850 35, 900 20, 1200 20"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeDasharray="4 8"
          opacity="0.6"
        />
        {/* Center decorative motif reminiscent of the calligraphic spiral */}
        <path
          d="M 580 20 C 585 10, 600 8, 605 14 C 610 20, 600 28, 592 24 C 586 20, 592 12, 600 12 C 612 12, 620 25, 600 32 C 580 39, 565 25, 578 12"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="600" cy="20" r="2.5" fill="currentColor" />
      </svg>
    </div>
  );
}
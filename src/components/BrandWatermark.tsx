import React from 'react';

interface BrandWatermarkProps {
  className?: string;
  position?: 'right' | 'center' | 'left';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  opacity?: number;
}

export default function BrandWatermark({
  className = '',
  position = 'right',
  size = 'lg',
  opacity = 0.04,
}: BrandWatermarkProps) {
  const sizeClasses = {
    sm: 'w-48 h-48',
    md: 'w-72 h-72 sm:w-96 sm:h-96',
    lg: 'w-96 h-96 sm:w-[32rem] sm:h-[32rem]',
    xl: 'w-[28rem] h-[28rem] sm:w-[42rem] sm:h-[42rem]',
  }[size];

  const positionClasses = {
    right: '-right-16 -top-16 sm:-right-24 sm:-top-24',
    center: 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
    left: '-left-16 -top-16 sm:-left-24 sm:-top-24',
  }[position];

  return (
    <div
      className={`absolute pointer-events-none select-none z-0 overflow-hidden ${positionClasses} ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <img
        src="/images/logo.png"
        alt=""
        className={`${sizeClasses} object-contain transform rotate-6 filter blur-[0.3px]`}
      />
    </div>
  );
}
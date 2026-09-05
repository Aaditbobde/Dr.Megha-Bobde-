'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

export interface GalleryPhoto {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  altText: string;
}

interface GalleryLightboxProps {
  images: GalleryPhoto[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function GalleryLightbox({
  images,
  initialIndex,
  isOpen,
  onClose,
}: GalleryLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  
  // Touch swipe state
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);
  const touchEndYRef = useRef<number | null>(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  // Lock body scroll while lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Touch Swipe Handlers for mobile gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
    touchEndYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (
      touchStartXRef.current === null ||
      touchStartYRef.current === null ||
      touchEndXRef.current === null ||
      touchEndYRef.current === null
    ) {
      return;
    }

    const deltaX = touchStartXRef.current - touchEndXRef.current;
    const deltaY = touchStartYRef.current - touchEndYRef.current;
    const minSwipeDistance = 45;

    // Check if swipe was mostly horizontal or vertical
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          // Swiped left -> show next
          handleNext();
        } else {
          // Swiped right -> show previous
          handlePrev();
        }
      }
    } else {
      // Vertical swipe: swipe down to close
      if (deltaY < -70) {
        // Swiped downwards significantly -> close lightbox
        onClose();
      }
    }

    // Reset touch coordinates
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    touchEndXRef.current = null;
    touchEndYRef.current = null;
  };

  if (!isOpen || images.length === 0) return null;

  const current = images[currentIndex];

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 animate-in fade-in duration-200 select-none touch-pan-y"
      onClick={(e) => {
        // Close if tapping background directly
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Top Bar with category, counter and Close Button (Min 48x48px target) */}
      <div className="flex items-center justify-between text-white z-20">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-600 text-white uppercase tracking-wider shadow-sm">
            {current.category}
          </span>
          <span className="text-xs text-cream-200/80 font-medium">
            {currentIndex + 1} of {images.length}
          </span>
        </div>

        <button
          onClick={onClose}
          className="min-w-[48px] min-h-[48px] flex items-center justify-center p-2.5 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/35 text-white transition-colors focus:outline-none"
          aria-label="Close Lightbox (or swipe down)"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Main Image Stage with Swipe Gestures */}
      <div 
        className="relative flex-1 flex items-center justify-center my-2 sm:my-4 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        {/* Previous Button (Large touch target) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="min-w-[48px] min-h-[48px] absolute left-1 sm:left-4 z-20 flex items-center justify-center p-2.5 sm:p-3.5 rounded-full bg-black/60 hover:bg-black/90 active:scale-95 text-white border border-white/20 transition-all shadow-lg"
          aria-label="Previous Image (or swipe right)"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        {/* Image Display */}
        <div className="max-w-5xl max-h-[72vh] relative flex flex-col items-center justify-center pointer-events-auto">
          <img
            src={current.imageUrl}
            alt={current.altText}
            loading="lazy"
            decoding="async"
            className="max-h-[68vh] sm:max-h-[72vh] max-w-[94vw] sm:max-w-full object-contain rounded-2xl shadow-2xl transition-all"
          />
        </div>

        {/* Next Button (Large touch target) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="min-w-[48px] min-h-[48px] absolute right-1 sm:right-4 z-20 flex items-center justify-center p-2.5 sm:p-3.5 rounded-full bg-black/60 hover:bg-black/90 active:scale-95 text-white border border-white/20 transition-all shadow-lg"
          aria-label="Next Image (or swipe left)"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      </div>

      {/* Bottom Caption, Mobile Gesture Hint, and Details */}
      <div className="text-center text-white space-y-1.5 max-w-2xl mx-auto z-20 px-2 pb-1">
        <h4 className="font-serif font-bold text-base sm:text-lg text-cream-100">{current.title}</h4>
        <p className="text-xs text-cream-200/80 leading-relaxed max-w-md mx-auto hidden sm:block">{current.altText}</p>
        <p className="text-[11px] text-brand-300/90 font-medium sm:hidden flex items-center justify-center gap-1">
          <span>Swipe left/right to browse · Swipe down or tap to close</span>
        </p>
      </div>
    </div>
  );
}
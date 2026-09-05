'use client';

import React, { useState, useEffect } from 'react';
import { Camera, ZoomIn, Calendar } from 'lucide-react';
import Link from 'next/link';
import GalleryLightbox, { GalleryPhoto } from '@/components/GalleryLightbox';
import BrandWatermark from '@/components/BrandWatermark';

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const categories = [
    'All',
    'Clinic Exterior',
    'Reception & Waiting Area',
    'Consultation Room',
    'Doctor at Work',
    'Certificates & Natural Remedies',
  ];

  useEffect(() => {
    async function loadGallery() {
      try {
        const res = await fetch('/api/gallery');
        if (res.ok) {
          const data = await res.json();
          setImages(data);
        }
      } catch (err) {
        console.error('Failed to load gallery images', err);
      } finally {
        setLoading(false);
      }
    }

    loadGallery();
  }, []);

  const filteredImages =
    selectedCategory === 'All'
      ? images
      : images.filter((img) => img.category === selectedCategory);

  const openLightbox = (index: number) => {
    setActivePhotoIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-14 sm:py-20 relative overflow-hidden">
      <BrandWatermark position="right" size="lg" opacity={0.04} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="px-3.5 py-1 text-xs font-semibold text-brand-700 bg-brand-50 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 border border-brand-200/60">
            <Camera className="w-3.5 h-3.5" />
            <span>Clinic Atmosphere & Care Facilities</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso-900 tracking-tight">
            Clinic Photo Gallery
          </h1>
          <p className="text-sm sm:text-base text-espresso-600 leading-relaxed max-w-2xl mx-auto">
            Take a virtual tour of Dr. Megha Bobde's Homoeo Clinic in Bavdhan, Pune. Explore our sanitized consultation chambers, welcoming reception, and authentic remedy dispensary.
          </p>
        </div>

        {/* Category Filters (Pills) */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-10 sm:mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`pill-btn min-h-[44px] px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-brand-lift'
                  : 'bg-white text-espresso-700 hover:bg-warm-100 border border-warm-200 shadow-warm-sm active:bg-tan-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        {loading ? (
          <div className="py-20 text-center text-xs text-espresso-500 animate-pulse">
            Loading clinic photos...
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="py-16 text-center text-xs text-espresso-500 boutique-card">
            No photos found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((img, idx) => (
              <div
                key={img.id}
                onClick={() => openLightbox(idx)}
                className="boutique-card overflow-hidden group cursor-pointer flex flex-col hover:border-brand-300 transition-all duration-300"
              >
                {/* Image Container */}
                <div className="aspect-[4/3] w-full overflow-hidden bg-warm-100 relative">
                  <img
                    src={img.imageUrl}
                    alt={img.altText}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter contrast-[1.02]"
                  />
                  {/* Category Pill */}
                  <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-[10px] font-bold bg-espresso-950/70 backdrop-blur-md text-white uppercase tracking-wider">
                    {img.category}
                  </span>

                  {/* Hover Overlay Zoom Icon */}
                  <div className="absolute inset-0 bg-brand-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <div className="p-3.5 rounded-full bg-white/25 backdrop-blur-md border border-white/40 transform scale-90 group-hover:scale-100 transition-transform">
                      <ZoomIn className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-1.5 flex-1 flex flex-col justify-between">
                  <h3 className="font-serif font-bold text-sm text-espresso-900 group-hover:text-brand-600 transition-colors">
                    {img.title}
                  </h3>
                  <p className="text-xs text-espresso-600 line-clamp-2 leading-relaxed">
                    {img.altText}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Booking Banner */}
        <div className="mt-16 bg-gradient-to-br from-brand-800 via-brand-700 to-espresso-950 rounded-3xl p-8 sm:p-10 text-white text-center sm:flex sm:items-center sm:justify-between sm:text-left shadow-brand-lift">
          <div className="space-y-1.5">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
              Experience the Peaceful Healing Atmosphere in Person
            </h3>
            <p className="text-xs sm:text-sm text-cream-200/90">
              Morning & evening consultation sessions scheduled by appointment to respect your time.
            </p>
          </div>
          <Link
            href="/book"
            className="pill-btn mt-5 sm:mt-0 px-7 py-3.5 bg-white text-brand-800 hover:bg-cream-100 font-semibold text-xs sm:text-sm shadow-xl transition-all shrink-0 flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-brand-600" />
            <span>Schedule Your Visit</span>
          </Link>
        </div>

      </div>

      {/* Lightbox Modal */}
      <GalleryLightbox
        images={filteredImages}
        initialIndex={activePhotoIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}
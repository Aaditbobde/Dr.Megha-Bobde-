'use client';

import React, { useState, useEffect } from 'react';
import { Star, MessageSquarePlus, CheckCircle2, Quote } from 'lucide-react';
import ReviewSubmissionModal from '@/components/ReviewSubmissionModal';

interface HomeReviewsSectionProps {
  rating: number;
  reviewCount: number;
}

export default function HomeReviewsSection({ rating, reviewCount }: HomeReviewsSectionProps) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch('/api/testimonials');
        if (res.ok) {
          const data = await res.json();
          setReviews(data.testimonials || []);
        }
      } catch (err) {
        console.error('Failed to load testimonials', err);
      } finally {
        setLoading(false);
      }
    }

    loadReviews();
  }, []);

  return (
    <section className="py-16 sm:py-24 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 border-b border-warm-200/80 pb-8">
          <div className="space-y-3">
            <span className="px-3.5 py-1 text-xs font-semibold text-brand-700 bg-brand-50 rounded-full uppercase tracking-wider border border-brand-200/60 inline-block">
              Patient Testimonials
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso-900 tracking-tight">
              Verified Patient Recovery Stories
            </h2>
            <p className="text-sm sm:text-base text-espresso-600 max-w-xl leading-relaxed">
              Real feedback from patients in Bavdhan, Kothrud, and Pune whose chronic conditions improved under Dr. Megha Bobde's homoeopathic care.
            </p>
          </div>

          {/* Google Score Banner & Review CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 bg-white p-4 sm:p-5 rounded-3xl border border-warm-200 shadow-warm-sm w-full sm:w-auto">
            <div className="text-center sm:text-left sm:pr-5 sm:border-r border-warm-200 w-full sm:w-auto flex sm:flex-col items-center justify-between sm:justify-start">
              <div>
                <span className="text-3xl sm:text-4xl font-bold text-espresso-900 font-serif leading-none block">
                  {rating.toFixed(1)}
                </span>
                <div className="flex text-amber-500 mt-1 justify-center sm:justify-start">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <span className="text-xs text-espresso-600 font-medium mt-1 block">
                {reviewCount} Google Reviews
              </span>
            </div>

            <div className="w-full sm:w-auto">
              <button
                onClick={() => setModalOpen(true)}
                className="pill-btn min-h-[44px] w-full sm:w-auto px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-brand-lift transition-all flex items-center justify-center gap-2"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Write a Review</span>
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.slice(0, 6).map((rev) => (
            <div
              key={rev.id}
              className="boutique-card p-6 sm:p-7 flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-500">
                    {[...Array(Math.round(rev.rating || 5))].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-espresso-400 font-medium">{rev.dateString}</span>
                </div>

                <div className="relative">
                  <Quote className="w-5 h-5 text-brand-200 absolute -top-1 -left-1 -z-0 opacity-60" />
                  <p className="text-xs text-espresso-700 italic leading-relaxed relative z-10 pl-2">
                    "{rev.reviewText}"
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-5 border-t border-warm-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-espresso-900">{rev.patientName}</h4>
                  <span className="text-[10px] font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full inline-block mt-0.5 border border-brand-200/50">
                    {rev.condition}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-sage-700 font-semibold bg-sage-50 px-2 py-0.5 rounded-full border border-sage-200">
                  <CheckCircle2 className="w-3 h-3 text-sage-600" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      <ReviewSubmissionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}
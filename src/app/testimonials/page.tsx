'use client';

import React, { useState, useEffect } from 'react';
import { Star, MessageSquarePlus, CheckCircle2, ShieldCheck, Heart, Search, Sparkles } from 'lucide-react';
import ReviewSubmissionModal from '@/components/ReviewSubmissionModal';
import BrandWatermark from '@/components/BrandWatermark';

export default function TestimonialsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState({ averageRating: 5.0, totalReviews: 62 });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch('/api/testimonials');
        if (res.ok) {
          const data = await res.json();
          setReviews(data.testimonials || []);
          if (data.stats) setStats(data.stats);
        }
      } catch (err) {
        console.error('Failed to load testimonials', err);
      } finally {
        setLoading(false);
      }
    }

    loadReviews();
  }, []);

  const filteredReviews = reviews.filter((r) => {
    const q = filterQuery.toLowerCase();
    return (
      r.patientName.toLowerCase().includes(q) ||
      r.condition.toLowerCase().includes(q) ||
      r.reviewText.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-14 sm:py-20 text-espresso-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-200/60 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            Patient Stories & Ratings
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso-950 tracking-tight">
            Google Reviews & Patient Feedback
          </h1>
          <p className="font-devanagari text-brand-700 text-sm font-medium">
            डॉ. मेघा बोबडे यांच्या क्लिनिकमधील रुग्णांचे अनुभव व प्रतिक्रिया
          </p>
          <p className="text-sm sm:text-base text-espresso-600 leading-relaxed max-w-2xl mx-auto">
            Authentic healing journeys and verified experiences from patients treated with classical homoeopathy and vibrational therapeutics at our Bavdhan, Pune clinic.
          </p>
        </div>

        {/* Rating Hero Card */}
        <div className="boutique-card p-8 sm:p-10 mb-12 relative overflow-hidden bg-white/90">
          <BrandWatermark className="opacity-[0.04] -right-16 -top-16 w-80 h-80" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="md:col-span-4 text-center md:text-left border-b md:border-b-0 md:border-r border-tan-200/80 pb-6 md:pb-0 md:pr-8">
              <div className="inline-flex items-center gap-3 mb-2">
                <span className="text-5xl sm:text-6xl font-serif font-bold text-espresso-950">
                  {stats.averageRating.toFixed(1)}
                </span>
                <div className="space-y-1 text-left">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-espresso-500 block font-medium">
                    Verified Google Rating
                  </span>
                </div>
              </div>
              <p className="text-xs text-espresso-600 leading-relaxed">
                Based on <strong className="text-espresso-900">{stats.totalReviews} genuine patient reviews</strong> on Google Maps with a flawless 5.0-star score.
              </p>
            </div>

            <div className="md:col-span-5 space-y-2.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-12 text-espresso-700 font-medium">5 Star</span>
                <div className="flex-1 bg-tan-200/70 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-brand-500 h-full w-[98%] rounded-full transition-all"></div>
                </div>
                <span className="w-8 text-right font-semibold text-espresso-900">98%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-12 text-espresso-700 font-medium">4 Star</span>
                <div className="flex-1 bg-tan-200/70 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-brand-400 h-full w-[2%] rounded-full transition-all"></div>
                </div>
                <span className="w-8 text-right font-semibold text-espresso-900">2%</span>
              </div>
              <div className="flex items-center gap-2 text-espresso-400">
                <span className="w-12">3 Star</span>
                <div className="flex-1 bg-tan-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-tan-300 h-full w-[0%] rounded-full"></div>
                </div>
                <span className="w-8 text-right">0%</span>
              </div>
            </div>

            <div className="md:col-span-3 text-center md:text-right">
              <button
                onClick={() => setModalOpen(true)}
                className="pill-btn inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md shadow-brand-500/20 active:scale-95"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Submit Your Review</span>
              </button>
            </div>

          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-8">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-400" />
            <input
              type="text"
              placeholder="Search by condition (e.g., Sinusitis, PCOS, Allergy)..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-tan-200 rounded-full text-xs text-espresso-900 placeholder:text-espresso-400 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
            />
          </div>
          <span className="text-xs text-espresso-500 font-medium">
            Showing <strong className="text-espresso-800">{filteredReviews.length}</strong> patient experiences
          </span>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="boutique-card p-6 flex flex-col justify-between bg-white hover:border-brand-300 transition-all duration-300"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(Math.round(rev.rating || 5))].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-espresso-400 font-medium">{rev.dateString}</span>
                </div>

                <p className="text-xs sm:text-[13px] text-espresso-700 leading-relaxed italic">
                  "{rev.reviewText}"
                </p>
              </div>

              <div className="pt-4 mt-5 border-t border-tan-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-serif font-bold text-espresso-950">{rev.patientName}</h4>
                  <span className="text-[10px] font-semibold text-brand-800 bg-brand-50 border border-brand-200/60 px-2.5 py-0.5 rounded-full inline-block mt-1">
                    Treated: {rev.condition}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-sage-700 font-medium bg-sage-50 border border-sage-200/60 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sage-600" />
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
    </div>
  );
}
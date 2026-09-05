'use client';

import React, { useState, useEffect } from 'react';
import { X, Star, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface ReviewSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReviewSubmissionModal({ isOpen, onClose }: ReviewSubmissionModalProps) {
  const [patientName, setPatientName] = useState('');
  const [condition, setCondition] = useState('');
  const [rating, setRating] = useState(5.0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lock body scroll when modal is open
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

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName,
          condition,
          rating,
          reviewText,
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        setError(d.error || 'Failed to submit review');
        return;
      }

      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setPatientName('');
    setCondition('');
    setReviewText('');
    setRating(5.0);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-espresso-950/70 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleReset();
      }}
    >
      <div className="relative w-full max-w-lg bg-[#FDFBF7] rounded-3xl shadow-2xl overflow-hidden border border-tan-200 text-espresso-950 animate-in fade-in zoom-in-95 duration-200 my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-espresso-950 px-5 sm:px-6 py-4 text-white flex justify-between items-center border-b border-espresso-800 shrink-0">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-brand-300 font-semibold uppercase tracking-wider mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Dr. Megha Bobde's Homoeo Clinic</span>
            </div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-cream-100">
              Share Your Healing Experience
            </h3>
            <p className="text-xs text-espresso-300">
              Bavdhan, Pune · Verified Patient Testimonials
            </p>
          </div>
          <button 
            onClick={handleReset} 
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-espresso-400 hover:text-white p-2 rounded-xl transition-colors focus:outline-none"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-5 sm:p-7 overflow-y-auto flex-1">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-sage-100 text-sage-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="font-serif text-xl sm:text-2xl font-bold text-espresso-950">
                Thank You for Your Feedback!
              </h4>
              <p className="text-sm text-espresso-600 max-w-sm mx-auto leading-relaxed">
                Your review has been received with gratitude and will be published to the clinic portal upon doctor verification.
              </p>
              <button
                onClick={handleReset}
                className="pill-btn min-h-[48px] mt-4 px-8 py-3 bg-brand-600 text-white rounded-full text-sm font-bold hover:bg-brand-700 shadow-md shadow-brand-500/20"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              {error && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Star Rating selector (Large 44x44px touch targets) */}
              <div>
                <label className="text-xs font-bold text-espresso-800 block mb-1.5 uppercase tracking-wider">
                  Overall Experience Rating
                </label>
                <div className="flex items-center gap-1 bg-white p-2 rounded-2xl border border-tan-200 w-fit">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-tan-300 hover:text-amber-400 active:scale-110 transition-all rounded-xl focus:outline-none"
                      aria-label={`Rate ${star} stars`}
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          star <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-tan-200'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm font-bold text-espresso-800 ml-2 mr-2">
                    {rating}.0 / 5.0
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-espresso-800 block mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  autoComplete="name"
                  placeholder="e.g. Priyadarshini M."
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full min-h-[48px] px-4 py-3 bg-white border border-tan-200 rounded-xl text-base text-espresso-900 placeholder:text-espresso-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-espresso-800 block mb-1">
                  Condition / Illness Treated *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chronic Sinusitis, Pediatric Tonsillitis, PCOS, Skin Allergy"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full min-h-[48px] px-4 py-3 bg-white border border-tan-200 rounded-xl text-base text-espresso-900 placeholder:text-espresso-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-espresso-800 block mb-1">
                  Your Review / Experience with Dr. Megha *
                </label>
                <textarea
                  rows={4}
                  placeholder="Share details about the doctor's diagnosis, case taking, recovery timeline, and clinic atmosphere..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-tan-200 rounded-xl text-base text-espresso-900 placeholder:text-espresso-400 focus:outline-none focus:ring-2 focus:ring-brand-500 leading-relaxed"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="pill-btn w-full min-h-[50px] py-3.5 rounded-full bg-brand-600 text-white font-bold text-base hover:bg-brand-700 shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>{submitting ? 'Submitting Review...' : 'Submit Patient Review'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
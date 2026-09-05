'use client';

import React, { useState } from 'react';
import AppointmentBookingModal from '@/components/AppointmentBookingModal';
import { Calendar, Clock, Phone, CheckCircle2, Sparkles } from 'lucide-react';
import BrandWatermark from '@/components/BrandWatermark';

export default function QuickBookSection() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section id="book-section" className="py-16 sm:py-24 bg-gradient-to-br from-brand-900 via-brand-800 to-espresso-950 text-white relative overflow-hidden">
      {/* Subtle Logo Watermark in QuickBook background */}
      <BrandWatermark position="right" size="xl" opacity={0.06} className="text-white brightness-0 invert" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-brand-200 text-xs font-semibold uppercase tracking-wider backdrop-blur-xs border border-white/10">
              <Clock className="w-3.5 h-3.5 text-sage-400" />
              <span>Mon–Sat: 10:30–1:30 & 6:00–8:30 | Sun: 11:00–1:30</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white tracking-tight">
              Ready for Deep, Root-Cause Constitutional Healing?
            </h2>

            <p className="text-sm sm:text-base text-cream-100/90 leading-relaxed max-w-xl">
              Consult <strong>Dr. Megha Abhijit Bobde (MD, BHMS)</strong> in person at our Bavdhan clinic or schedule an online video consultation & remote YFE vibrational therapy session.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-cream-200/90 pt-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sage-400 shrink-0" />
                <span>Zero Double-Booking Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sage-400 shrink-0" />
                <span>Instant WhatsApp Confirmation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sage-400 shrink-0" />
                <span>Homeopathy / YFE / Mind Yoga</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sage-400 shrink-0" />
                <span>Easy Parking at ABC Convenience Centre</span>
              </div>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row gap-3.5">
              <button
                onClick={() => setModalOpen(true)}
                className="pill-btn px-7 py-3.5 bg-white text-brand-800 hover:bg-cream-100 font-semibold text-sm shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-brand-600" />
                <span>Schedule Consultation Now</span>
              </button>

              <a
                href="tel:+919270113112"
                className="pill-btn px-6 py-3.5 border border-white/30 text-white hover:bg-white/10 font-medium text-sm transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-sage-300" />
                <span>Call +91 92701 13112</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 space-y-4 text-xs text-cream-100 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <h4 className="text-base font-serif font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-300" />
                  First Consultation Guide
                </h4>
                <span className="text-[10px] bg-brand-500/30 text-brand-200 px-2.5 py-0.5 rounded-full border border-brand-400/30 font-medium">
                  Boutique Care
                </span>
              </div>
              <p className="leading-relaxed text-cream-100/80">
                Dr. Megha conducts an exhaustive constitutional case analysis covering your emotional stressors, physical predispositions, and lifestyle modalities to prescribe precise Hahnemannian remedies.
              </p>
              <div className="space-y-2.5 bg-black/20 p-4 rounded-2xl border border-white/10 text-xs">
                <div className="flex justify-between">
                  <span className="text-cream-300">Doctor:</span>
                  <span className="font-semibold text-white">Dr. Megha Abhijit Bobde (MD, BHMS)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cream-300">Google Reputation:</span>
                  <span className="font-semibold text-amber-300">5.0 ★ (62 Reviews)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cream-300">Mon–Sat Hours:</span>
                  <span className="font-semibold text-sage-300">10:30–1:30 & 6:00–8:30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cream-300">Sunday Hours:</span>
                  <span className="font-semibold text-sage-300">11:00 AM – 1:30 PM</span>
                </div>
              </div>
              <p className="text-[11px] text-cream-200/80 text-center pt-1">
                Questions? Call <a href="tel:+919270113112" className="underline font-bold text-white">+91 92701 13112</a> or message on WhatsApp.
              </p>
            </div>
          </div>

        </div>
      </div>

      <AppointmentBookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}
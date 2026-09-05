import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ShieldCheck, Calendar, Sparkles } from 'lucide-react';
import BrandWatermark from '@/components/BrandWatermark';

export const metadata = {
  title: "Homoeopathic Treatments & Clinical Specialties | Dr. Megha Bobde",
  description: "Explore classical homoeopathic treatments for chronic illness, skin eczema/psoriasis, female hormonal health (PCOS), child immunity, and migraines at Dr. Megha Bobde's clinic in Bavdhan, Pune.",
};

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-14 sm:py-20 relative overflow-hidden">
      <BrandWatermark position="right" size="lg" opacity={0.04} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="px-3.5 py-1 text-xs font-semibold text-brand-700 bg-brand-50 rounded-full uppercase tracking-wider inline-block border border-brand-200/60">
            Comprehensive Clinical Care
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso-900 tracking-tight">
            Homoeopathic Specialties & Treatments
          </h1>
          <p className="text-sm sm:text-base text-espresso-600 leading-relaxed max-w-2xl mx-auto">
            Classical homoeopathy provides gentle, non-steroidal constitutional medicine for acute and chronic conditions. Discover our clinical care areas in Bavdhan, Pune.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="boutique-card p-7 sm:p-8 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-200/50">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 px-3 py-1 rounded-full uppercase tracking-wider border border-brand-200/60">
                    {service.category}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-xl text-espresso-900 group-hover:text-brand-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-espresso-600 mt-2 leading-relaxed">
                    {service.summary}
                  </p>
                </div>

                <div className="bg-warm-50 rounded-2xl p-3.5 space-y-1 text-xs border border-warm-200">
                  <span className="font-bold text-espresso-800 block text-[11px]">Key Indications:</span>
                  <p className="text-espresso-600 text-[11px] leading-relaxed">
                    {service.symptoms}
                  </p>
                </div>

                <div className="text-xs text-espresso-500 italic">
                  <strong className="text-espresso-800 not-italic">Homoeopathic Approach:</strong> {service.approach}
                </div>
              </div>

              <div className="pt-5 mt-6 border-t border-warm-200 flex items-center justify-between">
                <Link
                  href={`/services/${service.slug}`}
                  className="text-xs font-bold text-brand-700 hover:text-brand-900 inline-flex items-center gap-1"
                >
                  Full Condition Guide &rarr;
                </Link>

                <Link
                  href={`/book?service=${encodeURIComponent(service.title)}`}
                  className="pill-btn px-4 py-2 bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 shadow-brand-lift transition-all"
                >
                  <Calendar className="w-3.5 h-3.5 mr-1" />
                  Book Visit
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Booking Banner */}
        <div className="mt-16 bg-gradient-to-br from-brand-800 via-brand-700 to-espresso-950 rounded-3xl p-8 sm:p-10 text-white text-center sm:flex sm:items-center sm:justify-between sm:text-left shadow-brand-lift">
          <div className="space-y-1.5">
            <h3 className="font-serif text-xl sm:text-2xl font-bold">
              Not sure which treatment fits your symptoms?
            </h3>
            <p className="text-xs sm:text-sm text-cream-200/90">
              Schedule a comprehensive case consultation with Dr. Megha Bobde at our Bavdhan clinic.
            </p>
          </div>
          <Link
            href="/book"
            className="pill-btn mt-5 sm:mt-0 px-7 py-3.5 bg-white text-brand-800 hover:bg-cream-100 font-semibold text-xs sm:text-sm shadow-xl transition-all shrink-0 flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-brand-600" />
            <span>Book Doctor Consultation</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
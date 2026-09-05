import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  ShieldCheck, 
  Calendar, 
  Phone, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  MessageSquare,
  Sparkles
} from 'lucide-react';
import LiveStatusBadge from '@/components/LiveStatusBadge';
import BrandWatermark from '@/components/BrandWatermark';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const service = await prisma.service.findUnique({
    where: { slug: params.slug },
  });

  if (!service) return { title: 'Treatment Not Found' };

  return {
    title: `${service.title} Homoeopathic Care | Dr. Megha Bobde, Bavdhan Pune`,
    description: service.summary,
  };
}

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = await prisma.service.findUnique({
    where: { slug: params.slug },
  });

  if (!service) {
    notFound();
  }

  const otherServices = await prisma.service.findMany({
    where: { id: { not: service.id } },
    take: 3,
  });

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-12 sm:py-16 relative overflow-hidden">
      <BrandWatermark position="right" size="lg" opacity={0.03} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs font-semibold text-brand-700 hover:text-brand-900 bg-white px-3.5 py-1.5 rounded-full border border-warm-200 shadow-warm-sm transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Treatments & Clinical Care Areas</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-3">
              <span className="px-3.5 py-1 text-xs font-semibold text-brand-700 bg-brand-50 rounded-full uppercase tracking-wider inline-block border border-brand-200/60">
                {service.category}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso-900 leading-tight">
                {service.title}
              </h1>
              <p className="text-base sm:text-lg text-espresso-600 leading-relaxed font-medium">
                {service.summary}
              </p>
            </div>

            {/* Detailed Description */}
            <div className="boutique-card p-7 sm:p-8 space-y-4 text-xs sm:text-sm leading-relaxed text-espresso-700">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-espresso-900">
                Understanding the Condition & Homoeopathic Rationale
              </h3>
              <p className="whitespace-pre-line leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Symptoms / Indications */}
            <div className="boutique-card p-6 sm:p-7 space-y-3">
              <h4 className="font-serif font-bold text-base text-espresso-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-sage-600" />
                <span>Common Symptoms Addressed in This Category</span>
              </h4>
              <p className="text-xs text-espresso-600 leading-relaxed">
                {service.symptoms}
              </p>
            </div>

            {/* Treatment Philosophy */}
            <div className="boutique-card bg-brand-50/60 border-brand-200 p-6 sm:p-7 space-y-3">
              <h4 className="font-serif font-bold text-base text-espresso-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-600" />
                <span>Dr. Megha Bobde's Constitutional Methodology</span>
              </h4>
              <p className="text-xs text-espresso-700 leading-relaxed">
                {service.approach}
              </p>
              <div className="pt-2 text-[11px] text-brand-800 font-medium">
                *Remedies are selected on an individual constitutional basis rather than generic disease names.
              </div>
            </div>

            {/* Related Services */}
            <div className="pt-6 border-t border-warm-200">
              <h4 className="font-serif font-bold text-lg text-espresso-900 mb-4">
                Other Related Specialties
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {otherServices.map((other) => (
                  <Link
                    key={other.id}
                    href={`/services/${other.slug}`}
                    className="p-5 boutique-card hover:border-brand-300 transition-all group"
                  >
                    <span className="text-[10px] font-bold text-brand-700 uppercase block mb-1">
                      {other.category}
                    </span>
                    <h5 className="font-serif font-bold text-xs sm:text-sm text-espresso-900 group-hover:text-brand-600">
                      {other.title}
                    </h5>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar Booking & Clinic Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-brand-800 via-brand-700 to-espresso-950 text-white rounded-3xl p-7 sm:p-8 shadow-brand-lift space-y-5 relative overflow-hidden">
              <BrandWatermark position="right" size="md" opacity={0.07} className="brightness-0 invert" />

              <h3 className="font-serif font-bold text-xl sm:text-2xl text-white">
                Consult Dr. Megha for {service.title}
              </h3>
              <p className="text-xs text-cream-100/90 leading-relaxed">
                Schedule an in-depth constitutional consultation at our Bavdhan clinic or via online video call.
              </p>

              <div className="space-y-2.5 pt-3 border-t border-white/15 text-xs text-cream-200">
                <div className="flex items-center justify-between">
                  <span>Sessions:</span>
                  <span className="font-semibold text-white">10:30–1:30 & 6:00–8:30</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Location:</span>
                  <span className="font-semibold text-white">Bavdhan, Pune</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  <span className="text-sage-300 font-semibold">Appointments Open</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <Link
                  href={`/book?service=${encodeURIComponent(service.title)}`}
                  className="pill-btn w-full py-3.5 px-4 bg-white text-brand-800 hover:bg-cream-100 font-semibold text-xs shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-brand-600" />
                  <span>Book Consultation Slot</span>
                </Link>

                <a
                  href={`https://api.whatsapp.com/send/?phone=919270113112&text=Hello%20Dr.%20Megha,%20I%20would%20like%20to%20consult%20for%20${encodeURIComponent(service.title)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill-btn w-full py-3 px-4 border border-sage-300/40 bg-sage-50 text-sage-900 hover:bg-sage-100 font-semibold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-sage-600" />
                  <span>WhatsApp Inquiry</span>
                </a>

                <a
                  href="tel:+919270113112"
                  className="pill-btn w-full py-3 px-4 border border-white/20 hover:bg-white/10 text-white font-medium text-xs transition-all flex items-center justify-center gap-2 font-mono"
                >
                  <Phone className="w-4 h-4 text-brand-300" />
                  <span>+91 92701 13112</span>
                </a>
              </div>
            </div>

            {/* Clinic Info Box */}
            <div className="boutique-card p-6 space-y-3 text-xs text-espresso-700">
              <h5 className="font-serif font-bold text-espresso-900 uppercase tracking-wider text-[11px]">
                Clinic Address & Plus Code
              </h5>
              <p className="leading-relaxed">
                Shop No. B1, ABC Convenience Centre, beside Marigold Banquets, Bavdhan, Pune, Maharashtra 411021
              </p>
              <p className="text-espresso-500 font-mono">
                Plus Code: <strong className="text-espresso-900">GQ46+FM Pune</strong>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
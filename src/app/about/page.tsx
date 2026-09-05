import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Heart, 
  Award, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Phone, 
  Calendar,
  Sparkles,
  ExternalLink,
  Camera,
  Smile,
  Instagram
} from 'lucide-react';
import LiveStatusBadge from '@/components/LiveStatusBadge';
import BrandWatermark from '@/components/BrandWatermark';
import SwirlDivider from '@/components/SwirlDivider';

export const metadata = {
  title: "About Dr. Megha Abhijit Bobde | MD (Mumbai), BHMS Homoeopath in Bavdhan, Pune",
  description: "Learn about Dr. Megha Abhijit Bobde (MD Mumbai, BHMS), her 15+ years experience supporting 2,000+ patients, and her integrated modalities: Classical Homeopathy, Yogananda Flower Essences, and Mind Power Yoga.",
};

export default async function AboutPage() {
  const [settings, galleryPhotos] = await Promise.all([
    prisma.clinicSetting.findUnique({ where: { id: 'clinic-settings' } }),
    prisma.galleryImage.findMany({ take: 3, orderBy: { order: 'asc' } }),
  ]);

  return (
    <div className="bg-[#FDFBF7]">
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF4EC] via-[#FDFBF7] to-[#FDFBF7] py-14 sm:py-20 border-b border-warm-200/80">
        <BrandWatermark position="right" size="lg" opacity={0.05} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-50 text-brand-900 border border-brand-200/70 text-xs font-semibold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-brand-500 fill-brand-400" />
            <span>Women-Owned & Operated Practice</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso-900 tracking-tight">
            About Dr. Megha Abhijit Bobde
          </h1>
          <p className="font-devanagari text-lg sm:text-xl text-brand-700 font-medium pt-1">
            डॉ. मेघा बोबडे 'स होम्यो क्लिनिक · Bavdhan, Pune
          </p>
          <p className="text-sm sm:text-base text-espresso-600 leading-relaxed max-w-2xl mx-auto">
            MD (Mumbai), BHMS · Over 15 years of dedicated clinical experience supporting more than 2,000 patients across Pune and globally through Classical Homeopathy, Yogananda Flower Essences, and Mind Power Yoga.
          </p>
        </div>
      </section>

      {/* Main Bio & Credentials */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Visual Profile Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-gradient-to-br from-brand-800 via-brand-700 to-espresso-950 rounded-3xl p-8 text-white shadow-brand-lift relative overflow-hidden">
                <BrandWatermark position="right" size="md" opacity={0.08} className="brightness-0 invert" />

                <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md p-3 flex items-center justify-center mb-6 border border-white/20">
                  <img
                    src="/images/logo.png"
                    alt="Logo"
                    className="w-full h-full object-contain brightness-0 invert"
                  />
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold">Dr. Megha Abhijit Bobde</h3>
                <p className="text-sm font-semibold text-brand-200 mt-1">
                  MD (Mumbai), BHMS Homoeopath
                </p>
                <p className="text-xs text-cream-200/80 mt-1">
                  15+ Years Clinical Practice · 2,000+ Patients Supported
                </p>

                <div className="w-full h-px bg-white/15 my-6"></div>

                <div className="space-y-3.5 text-xs text-cream-100">
                  <div className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-brand-300 shrink-0" />
                    <span>Qualifications: MD (Mumbai), BHMS from premier homoeopathic institutions</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-brand-300 shrink-0" />
                    <span>Certified Yogananda Flower Essences (YFE) Practitioner</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Smile className="w-4 h-4 text-brand-300 shrink-0" />
                    <span>Mind Power Yoga & Pranic Breathwork Guide</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-brand-300 shrink-0" />
                    <span>Bavdhan, Pune, Maharashtra (Plus Code: GQ46+FM)</span>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-white/15 flex items-center justify-between text-xs">
                  <span className="text-cream-200">Google Reputation:</span>
                  <span className="font-bold text-amber-300">5.0 ★ (62 Verified Reviews)</span>
                </div>
              </div>

              {/* Clinic Photos Preview Strip */}
              {galleryPhotos.length > 0 && (
                <div className="boutique-card p-5 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-espresso-900 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-brand-600" />
                      Clinic Tour Preview
                    </span>
                    <Link href="/gallery" className="text-brand-700 hover:text-brand-900 font-semibold text-[11px]">
                      View All Photos &rarr;
                    </Link>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {galleryPhotos.map((photo) => (
                      <Link
                        key={photo.id}
                        href="/gallery"
                        className="rounded-2xl overflow-hidden aspect-square bg-warm-100 block group border border-warm-200"
                      >
                        <img
                          src={photo.imageUrl}
                          alt={photo.altText}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Consultation Hours Quick Box */}
              <div className="boutique-card p-6 space-y-3.5 text-xs text-espresso-700">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-espresso-900 uppercase tracking-wider text-[11px]">
                    Confirmed Schedule
                  </span>
                  <LiveStatusBadge />
                </div>
                <div className="space-y-1 bg-warm-50 p-3 rounded-2xl border border-warm-200">
                  <span className="font-semibold block text-espresso-900">
                    Monday – Saturday (Split Sessions):
                  </span>
                  <span className="text-brand-700 font-bold block">
                    10:30 AM – 1:30 PM & 6:00 PM – 8:30 PM
                  </span>
                  <span className="font-semibold block text-espresso-900 pt-1">
                    Sunday (Morning Session Only):
                  </span>
                  <span className="text-sage-700 font-bold block">
                    11:00 AM – 1:30 PM
                  </span>
                </div>
                <div className="pt-2 border-t border-warm-200 flex items-center justify-between">
                  <span>Direct Line:</span>
                  <a href="tel:+919270113112" className="text-brand-700 font-bold hover:underline font-mono">
                    +91 92701 13112
                  </a>
                </div>
              </div>
            </div>

            {/* Comprehensive Biography & Philosophy */}
            <div className="lg:col-span-7 space-y-6 text-sm text-espresso-700 leading-relaxed">
              <div>
                <span className="px-3.5 py-1 text-xs font-semibold text-brand-700 bg-brand-50 rounded-full uppercase tracking-wider inline-block mb-3 border border-brand-200/60">
                  Philosophy & Clinical Approach
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-espresso-900 leading-snug tracking-tight">
                  "Healing Beyond the Clinic Walls: Treating the Whole Person."
                </h2>
              </div>

              <p>
                With over 15 years of rigorous clinical practice and more than 2,000 patient success stories, <strong className="text-espresso-900">Dr. Megha Abhijit Bobde (MD Mumbai, BHMS)</strong> has established her Bavdhan practice as a sanctuary of genuine holistic healing. Her philosophy centers on creating an empathetic, compassionate environment that positively influences patients' lives well beyond physical consultations.
              </p>

              <p>
                Rather than viewing diseases as isolated physiological errors to be quieted with suppressive pharmaceuticals, Dr. Megha recognizes that modern lifestyle, unresolved emotional conflicts, and environmental burdens manifest across mind, body, and spirit. Her treatment strategy synthesizes three distinct healing modalities:
              </p>

              {/* 3 Modalities Cards */}
              <div className="space-y-4">
                <div className="boutique-card p-6 space-y-2">
                  <div className="flex items-center gap-2 text-espresso-900 font-serif font-bold text-base">
                    <ShieldCheck className="w-5 h-5 text-brand-600 shrink-0" />
                    <span>1. Classical & Advanced Homeopathy</span>
                  </div>
                  <p className="text-xs text-espresso-600 leading-relaxed">
                    The core clinical foundation. Prescribing single, constitutional remedies tailored to the unique totality of symptoms. Gently stimulates the innate vital force to cure deep-seated chronic illness, allergies, asthma, and PCOS without suppressive side effects.
                  </p>
                </div>

                {/* YFE Dedicated Feature */}
                <div className="boutique-card p-6 bg-brand-50/50 border-brand-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-espresso-900 font-serif font-bold text-base">
                      <Sparkles className="w-5 h-5 text-brand-600 shrink-0" />
                      <span>2. Yogananda Flower Essences (YFE) Therapy</span>
                    </div>
                    <a
                      href="https://www.yoganandafloweressences.com/products/dr-megha"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-brand-700 hover:text-brand-900 inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-brand-200 shadow-warm-sm"
                    >
                      <span>YFE Official Directory</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-xs text-espresso-700 leading-relaxed">
                    Vibrational botanical therapy formulated to harmonize the emotional and astral planes. Dr. Megha integrates telepathic wrist-holding, guided affirmations, and personalized flower essences to dissolve subconscious grief, chronic anxiety, lack of mental clarity, and emotional exhaustion. Available both in-clinic and via remote sessions.
                  </p>
                </div>

                <div className="boutique-card p-6 space-y-2">
                  <div className="flex items-center gap-2 text-espresso-900 font-serif font-bold text-base">
                    <Smile className="w-5 h-5 text-brand-600 shrink-0" />
                    <span>3. Mind Power Yoga & Inner Poise</span>
                  </div>
                  <p className="text-xs text-espresso-600 leading-relaxed">
                    A spiritual and mental resilience practice incorporating conscious pranayama (breath control) and neuro-spiritual focusing. Helps patients cultivate inner serenity, overcome chronic burnout, and maintain nervous system stability.
                  </p>
                </div>
              </div>

              {/* Women-Owned Ethos */}
              <div className="boutique-card bg-brand-50/70 border-brand-200 p-6 space-y-2">
                <div className="flex items-center gap-2 text-brand-900 font-serif font-bold text-base">
                  <Heart className="w-5 h-5 text-brand-500 fill-brand-400" />
                  <span>A Women-Owned, Compassionate Sanctuary</span>
                </div>
                <p className="text-xs text-espresso-700 leading-relaxed">
                  As a woman physician and entrepreneur, Dr. Megha Bobde brings deep empathy to women's hormonal struggles, pediatric anxieties, and emotional sensitivities. Consultations are unhurried, respectful dialogues where every patient is heard and cared for.
                </p>
              </div>

              {/* Booking CTA */}
              <div className="pt-4 flex flex-wrap gap-3.5">
                <Link
                  href="/book"
                  className="pill-btn px-7 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm shadow-brand-lift transition-all flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Consultation with Dr. Megha</span>
                </Link>

                <a
                  href="tel:+919270113112"
                  className="pill-btn px-6 py-3.5 border border-warm-300 bg-white hover:bg-warm-50 text-espresso-800 font-semibold text-xs sm:text-sm shadow-warm-sm transition-all flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-brand-600" />
                  <span>Call +91 92701 13112</span>
                </a>

                <a
                  href="https://www.instagram.com/dr.megha_bobde/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill-btn px-5 py-3.5 border border-brand-200 bg-brand-50 text-brand-900 hover:bg-brand-100 font-medium text-xs sm:text-sm shadow-warm-sm transition-all flex items-center gap-2"
                >
                  <Instagram className="w-4 h-4 text-brand-600" />
                  <span>Instagram</span>
                </a>
              </div>

            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
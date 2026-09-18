import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Star, 
  Clock, 
  MapPin, 
  Phone, 
  Heart, 
  Sparkles, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare,
  Award,
  Camera,
  ExternalLink
} from 'lucide-react';
import LiveStatusBadge from '@/components/LiveStatusBadge';
import QuickBookSection from './QuickBookSection';
import HomeReviewsSection from './HomeReviewsSection';
import SwirlDivider from '@/components/SwirlDivider';
import BrandWatermark from '@/components/BrandWatermark';

export const revalidate = 60; // ISR revalidate every 60s

export default async function HomePage() {
  const [settings, hours, featuredServices, recentPosts, galleryPhotos] = await Promise.all([
    prisma.clinicSetting.findUnique({ where: { id: 'clinic-settings' } }),
    prisma.businessHour.findMany({ orderBy: { dayOfWeek: 'asc' } }),
    prisma.service.findMany({
      where: { isFeatured: true },
      orderBy: { order: 'asc' },
      take: 6,
    }),
    prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    }),
    prisma.galleryImage.findMany({
      where: { isFeatured: true },
      orderBy: { order: 'asc' },
      take: 4,
    }),
  ]);

  const rating = settings?.rating || 5.0;
  const reviewCount = settings?.reviewCount || 62;

  return (
    <div className="flex flex-col bg-[#FDFBF7]">
      
      {/* Notice Banner if active */}
      {settings?.noticeActive && settings?.noticeBanner && (
        <div className="bg-brand-50 border-b border-brand-200 text-brand-950 px-4 py-2 text-xs sm:text-sm text-center font-medium">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-brand-500 animate-ping"></span>
            <span>{settings.noticeBanner}</span>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF4EC] via-[#FDFBF7] to-[#FDFBF7] pt-12 pb-16 lg:pt-20 lg:pb-24">
        {/* Subtle Organic Logo Watermark */}
        <BrandWatermark position="right" size="xl" opacity={0.05} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading & Intro */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Trust Badges Bar */}
              <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3">
                {/* 5.0 Star Google Rating */}
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white border border-warm-200 rounded-full text-xs font-semibold text-espresso-800 shadow-warm-sm">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  </div>
                  <span>{rating.toFixed(1)} ★ ({reviewCount} Google Reviews)</span>
                </div>

                {/* Women Owned Badge */}
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-brand-50 border border-brand-200/70 rounded-full text-xs font-medium text-brand-900">
                  <Heart className="w-3.5 h-3.5 text-brand-500 fill-brand-400" />
                  <span>Women-Owned Practice</span>
                </div>

                {/* Experience Pill */}
                <span className="text-xs text-brand-800 font-semibold bg-white border border-warm-200 px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-warm-sm">
                  <Award className="w-3.5 h-3.5 text-brand-600" />
                  {settings?.experience || '15+ Years'} · {settings?.patientsTreated || '2,000+ Patients'}
                </span>
              </div>

              {/* Title & Subtitles */}
              <div className="space-y-2">
                <p className="text-xs sm:text-sm font-semibold tracking-widest text-brand-700 uppercase">
                  {settings?.tagline || 'Root-Cause Holistic Healing'}
                </p>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-espresso-900 tracking-tight leading-[1.15]">
                  {settings?.heroHeadline || "Dr. Megha Bobde's"}
                  <span className="block text-brand-600 mt-1">{settings?.heroSubheadline || 'Homoeo Clinic'}</span>
                </h1>
                <p className="font-devanagari text-base sm:text-xl text-brand-800 font-medium tracking-wide pt-1">
                  {settings?.clinicNameHi || "डॉ. मेघा बोबडे 'स होम्यो क्लिनिक"} · Bavdhan, Pune
                </p>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-espresso-600 max-w-2xl leading-relaxed">
                Healing beyond clinic walls. Led by <strong className="text-espresso-900">Dr. Megha Abhijit Bobde — MD (Mumbai), BHMS</strong> — seamlessly integrating <strong>Classical & Advanced Homeopathy</strong>, <strong>Yogananda Flower Essences (YFE)</strong> vibrational therapy, and <strong>Mind Power Yoga</strong> to treat the whole person rather than just suppressing surface symptoms.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/book"
                  className="pill-btn w-full sm:w-auto px-7 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-brand-lift transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Consultation</span>
                </Link>

                <a
                  href="tel:+919270113112"
                  className="pill-btn w-full sm:w-auto px-6 py-3.5 border border-warm-300 bg-white hover:bg-warm-50 text-espresso-800 font-semibold text-sm transition-all shadow-warm-sm flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-brand-600" />
                  <span>Call +91 92701 13112</span>
                </a>

                <a
                  href="https://api.whatsapp.com/send/?phone=919270113112&text=Hello%20Dr.%20Megha,%20I%20would%20like%20to%20inquire%20about%20a%20consultation."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill-btn w-full sm:w-auto px-5 py-3.5 border border-sage-200 bg-sage-50 hover:bg-sage-100 text-sage-900 font-semibold text-sm transition-all shadow-warm-sm flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-sage-600" />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Bullet Highlights */}
              <div className="pt-5 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-espresso-700 border-t border-warm-200/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                  <span className="font-medium">Classical Homoeopathy</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                  <span className="font-medium">YFE Vibrational Essences</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                  <span className="font-medium">Mind Power Yoga</span>
                </div>
              </div>
            </div>

            {/* Right Column: Doctor Spotlight & Live Info Card */}
            <div className="lg:col-span-5">
              <div className="boutique-card p-7 sm:p-8 relative">
                <div className="absolute -top-3 right-6">
                  <LiveStatusBadge showDetails={false} />
                </div>

                <div className="flex items-center gap-4 border-b border-warm-200 pb-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-700 to-brand-500 p-2.5 flex items-center justify-center shadow-brand-lift shrink-0">
                    <img
                      src="/images/logo.png"
                      alt="Logo"
                      className="w-full h-full object-contain brightness-0 invert"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-espresso-900">
                      Dr. Megha Abhijit Bobde
                    </h3>
                    <p className="text-xs font-semibold text-brand-700">
                      MD (Mumbai), BHMS Homoeopath
                    </p>
                    <p className="text-xs text-espresso-500">
                      15+ Years Clinical Practice · 2,000+ Patients
                    </p>
                  </div>
                </div>

                {/* Key Clinic Details */}
                <div className="py-5 space-y-3.5 text-xs text-espresso-700 border-b border-warm-200">
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-espresso-900 block">Weekly Clinic Schedule</span>
                      <span className="text-espresso-600 block">Mon – Sat: 10:30 AM – 1:30 PM & 6:00 – 8:30 PM</span>
                      <span className="text-sage-700 block font-semibold">Sunday: 11:00 AM – 1:30 PM (Morning Only)</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-espresso-900 block">Bavdhan Clinic Address</span>
                      <span className="text-espresso-600 leading-relaxed block">Shop No. B1, ABC Convenience Centre, beside Marigold Banquets, Bavdhan, Pune 411021</span>
                      <span className="text-brand-700 block text-[11px] font-mono mt-0.5">Plus Code: GQ46+FM Pune</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-espresso-900 block">Direct Clinic Line</span>
                      <a href="tel:+919270113112" className="text-brand-700 font-bold hover:underline font-mono">
                        +91 92701 13112 (Click to Call)
                      </a>
                    </div>
                  </div>
                </div>

                {/* Rating snapshot */}
                <div className="pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-espresso-900">5.0 Star Excellence</span>
                  </div>
                  <Link href="/testimonials" className="text-xs text-brand-700 hover:text-brand-900 font-semibold">
                    Read 62 Reviews &rarr;
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Quick-Glance Info Bar */}
      <section className="bg-espresso-950 text-cream-100 py-4 px-4 border-y border-espresso-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-cream-200/90">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-400" />
              <span>Shop B1, ABC Convenience Centre, Bavdhan, Pune</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sage-400" />
              <span>Sessions: 10:30–1:30 & 6:00–8:30 (Mon–Sat) | Sun 11:00–1:30</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-400" />
              <a href="tel:+919270113112" className="hover:text-brand-300 font-bold font-mono">
                +91 92701 13112
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LiveStatusBadge />
            <Link
              href="/contact"
              className="pill-btn px-3.5 py-1.5 bg-espresso-900 hover:bg-espresso-800 text-cream-100 border border-espresso-800 text-[11px] transition-colors"
            >
              Directions / Map &rarr;
            </Link>
          </div>
        </div>
      </section>

      <SwirlDivider />

      {/* Three Integrated Modalities Banner */}
      <section className="py-16 sm:py-24 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="px-3.5 py-1 text-xs font-semibold text-brand-700 bg-brand-50 rounded-full uppercase tracking-wider border border-brand-200/60 inline-block">
              Three-Pillar Holistic System
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso-900 tracking-tight">
              Treating the Whole Person: Our Integrated Modalities
            </h2>
            <p className="text-sm sm:text-base text-espresso-600 leading-relaxed max-w-xl mx-auto">
              Chronic illness and emotional stress require synchronization across physical, vibrational, and mental planes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Modality 1 */}
            <div className="boutique-card p-8 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-lg font-serif">
                  1
                </div>
                <h3 className="font-serif font-bold text-xl text-espresso-900 group-hover:text-brand-600 transition-colors">
                  Classical & Advanced Homeopathy
                </h3>
                <p className="text-xs text-espresso-600 leading-relaxed">
                  Core clinical therapy based on authentic Hahnemannian principles. Targets the biological vital force to cure deep-seated chronic illness, allergies, asthma, and PCOS without suppressive drugs.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-warm-200">
                <Link href="/services/classical-advanced-homeopathy" className="text-xs font-bold text-brand-700 hover:text-brand-900 inline-flex items-center gap-1">
                  Learn about Homeopathy &rarr;
                </Link>
              </div>
            </div>

            {/* Modality 2 */}
            <div className="boutique-card p-8 bg-brand-50/50 border-brand-200 flex flex-col justify-between group relative overflow-hidden">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-bold text-lg shadow-brand-lift">
                  2
                </div>
                <div>
                  <span className="text-[10px] font-bold text-brand-800 uppercase bg-brand-100 px-2.5 py-0.5 rounded-full inline-block mb-1 border border-brand-200/60">
                    Vibrational Medicine
                  </span>
                  <h3 className="font-serif font-bold text-xl text-espresso-900 group-hover:text-brand-600 transition-colors">
                    Yogananda Flower Essences (YFE)
                  </h3>
                </div>
                <p className="text-xs text-espresso-600 leading-relaxed">
                  Subconscious emotional healing through floral vibrational signatures, telepathic wrist-holding, and positive affirmations. Available in-clinic and via remote sessions for outstation patients.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-brand-200 flex items-center justify-between text-xs">
                <Link href="/services/yogananda-flower-essences-therapy" className="font-bold text-brand-700 hover:underline">
                  Explore YFE Therapy &rarr;
                </Link>
                <a
                  href="https://www.yoganandafloweressences.com/products/dr-megha"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-espresso-500 hover:text-brand-700 text-[11px] inline-flex items-center gap-0.5"
                >
                  <span>YFE Directory</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Modality 3 */}
            <div className="boutique-card p-8 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-lg font-serif">
                  3
                </div>
                <h3 className="font-serif font-bold text-xl text-espresso-900 group-hover:text-brand-600 transition-colors">
                  Mind Power Yoga & Poise
                </h3>
                <p className="text-xs text-espresso-600 leading-relaxed">
                  Guided pranic breathwork and neuro-spiritual focusing to fortify mental resilience, dispel psychosomatic tension, and calm nervous exhaustion.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-warm-200">
                <Link href="/services/mind-power-yoga" className="text-xs font-bold text-brand-700 hover:text-brand-900 inline-flex items-center gap-1">
                  Explore Mind Power Yoga &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SwirlDivider />

      {/* Clinic Photo Gallery Preview Strip */}
      <section className="py-16 sm:py-20 bg-[#FAF6F0] border-y border-warm-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
            <div>
              <span className="px-3.5 py-1 text-xs font-semibold text-brand-700 bg-brand-50 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 border border-brand-200/60">
                <Camera className="w-3.5 h-3.5" />
                <span>Clinic Tour</span>
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-espresso-900 mt-2">
                Inside Dr. Megha Bobde's Clinic
              </h2>
            </div>
            <Link
              href="/gallery"
              className="text-xs sm:text-sm font-semibold text-brand-700 hover:text-brand-900 inline-flex items-center gap-1"
            >
              <span>View Full Photo Gallery ({galleryPhotos.length}+)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {galleryPhotos.map((photo) => (
              <Link
                key={photo.id}
                href="/gallery"
                className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-warm-200 border border-warm-300/60 shadow-warm-sm hover:shadow-warm-md transition-all"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.altText}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter contrast-[1.02] brightness-[0.98]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/80 via-transparent to-transparent opacity-85 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white">
                  <span className="text-[10px] uppercase font-bold text-brand-300">{photo.category}</span>
                  <span className="text-xs font-serif font-semibold truncate">{photo.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Testimonials & Google 5.0 Showcase */}
      <HomeReviewsSection rating={rating} reviewCount={reviewCount} />

      {/* Quick Interactive Booking Section */}
      <QuickBookSection />

      <SwirlDivider />

      {/* Health Blog / Educational Tips Preview */}
      <section className="py-16 sm:py-24 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <span className="px-3.5 py-1 text-xs font-semibold text-brand-700 bg-brand-50 rounded-full uppercase tracking-wider border border-brand-200/60 inline-block">
                Health Insights
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-900 mt-2">
                Articles & Holistic Tips by Dr. Megha
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-xs sm:text-sm font-semibold text-brand-700 hover:text-brand-900 inline-flex items-center gap-1"
            >
              View All Articles &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <article
                key={post.id}
                className="boutique-card overflow-hidden flex flex-col justify-between"
              >
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-espresso-500">
                    <span className="font-semibold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200/50">
                      {post.category}
                    </span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-espresso-900 leading-snug hover:text-brand-700 transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-xs text-espresso-600 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="px-6 pb-5 pt-2 border-t border-warm-200 flex items-center justify-between text-xs">
                  <span className="text-espresso-500 text-[11px]">{post.author}</span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="font-bold text-brand-700 hover:text-brand-900 inline-flex items-center gap-1"
                  >
                    Read &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Map Quick Glance */}
      <section className="py-14 bg-[#FAF6F0] border-t border-warm-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-warm-200 rounded-3xl p-7 sm:p-9 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-warm-sm">
            <div className="space-y-2 text-center lg:text-left">
              <span className="text-xs font-semibold text-brand-700 uppercase tracking-wider">
                Visit Us in Bavdhan, Pune
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-espresso-900">
                Convenient Location with Easy Parking
              </h3>
              <p className="text-xs sm:text-sm text-espresso-600 max-w-xl leading-relaxed">
                Shop No. B1, ABC Convenience Centre, beside Marigold Banquets, Bavdhan, Pune 411021. Plus Code: <strong className="font-mono text-espresso-900">GQ46+FM Pune, Maharashtra</strong>.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="pill-btn px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-brand-lift transition-all"
              >
                View Embedded Map & Directions
              </Link>
              <a
                href="https://maps.google.com/?q=GQ46%2BFM+Pune,+Maharashtra"
                target="_blank"
                rel="noopener noreferrer"
                className="pill-btn px-6 py-3 border border-warm-300 bg-white text-espresso-800 font-semibold text-xs hover:bg-warm-50 shadow-warm-sm transition-all"
              >
                Open Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
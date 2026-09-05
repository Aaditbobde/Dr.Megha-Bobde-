import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Star, Heart, Navigation, Instagram, ExternalLink, Sparkles } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-[#FAF6F0] text-espresso-800 pt-16 pb-24 md:pb-12 border-t border-warm-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Brand Header in Footer */}
        <div className="text-center pb-12 mb-12 border-b border-warm-200/80 max-w-2xl mx-auto space-y-3">
          <Logo variant="footer" />
          <p className="text-xs text-espresso-600 leading-relaxed max-w-lg mx-auto">
            Gentle, constitutional healing for chronic ailments and holistic mind-body vitality in Bavdhan, Pune.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Clinic Brand & Doctor Info */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-sm text-espresso-900 tracking-wider uppercase">
              About the Practice
            </h4>

            <p className="text-xs text-espresso-600 leading-relaxed">
              Led by <strong className="text-espresso-900">Dr. Megha Abhijit Bobde (MD Mumbai, BHMS)</strong> with over 15 years of clinical excellence supporting 2,000+ patients. Integrating Classical Homoeopathy, Yogananda Flower Essences (YFE), and Mind Power Yoga.
            </p>

            {/* Google Rating Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white rounded-full border border-warm-200 text-xs shadow-warm-sm">
              <div className="flex items-center text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-espresso-900 ml-1">5.0</span>
              </div>
              <span className="text-warm-400">·</span>
              <span className="text-espresso-700 font-medium">62 Google Reviews</span>
            </div>

            {/* Women-owned note */}
            <div className="flex items-center gap-2 text-xs text-brand-900 bg-brand-50/80 p-2.5 rounded-2xl border border-brand-200/60">
              <Heart className="w-4 h-4 text-brand-500 fill-brand-400 shrink-0" />
              <span className="text-[11px] leading-tight">Women-owned, empathetic classical homoeopathic clinic.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-espresso-900 tracking-wider uppercase">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs text-espresso-600">
              <li>
                <Link href="/" className="hover:text-brand-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-600 transition-colors">
                  About Dr. Megha Bobde (MD, BHMS)
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-brand-600 transition-colors">
                  3 Healing Modalities & Care
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-brand-600 transition-colors font-medium text-brand-700">
                  Clinic Photo Gallery & Tour
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="hover:text-brand-600 transition-colors">
                  Patient Reviews & Stories (62)
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-brand-600 transition-colors">
                  Homoeopathy & Health Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-600 transition-colors">
                  Contact Clinic & Map Directions
                </Link>
              </li>
              <li>
                <Link href="/book" className="hover:text-brand-700 transition-colors font-semibold text-brand-600">
                  Book Consultation Slot
                </Link>
              </li>
              <li>
                <a
                  href="https://www.yoganandafloweressences.com/products/dr-megha"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-600 text-espresso-500 inline-flex items-center gap-1"
                >
                  <span>Official YFE Practitioner Page</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-espresso-800 text-espresso-400">
                  Doctor Login / CMS
                </Link>
              </li>
            </ul>
          </div>

          {/* 3 Core Modalities & Care */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-espresso-900 tracking-wider uppercase">
              3 Healing Pillars
            </h4>
            <ul className="space-y-3 text-xs text-espresso-600">
              <li className="space-y-1 bg-white p-3 rounded-2xl border border-warm-200 shadow-warm-sm">
                <strong className="text-espresso-900 block font-semibold">1. Classical Homoeopathy:</strong>
                <span className="text-[11px] leading-relaxed block">Constitutional treatment for chronic allergies, PCOS, pediatric health, and migraines.</span>
              </li>
              <li className="space-y-1 bg-white p-3 rounded-2xl border border-warm-200 shadow-warm-sm">
                <strong className="text-espresso-900 block font-semibold">2. YFE Vibrational Therapy:</strong>
                <span className="text-[11px] leading-relaxed block">Telepathic wrist-holding, personalized flower affirmations, and remote healing.</span>
              </li>
              <li className="space-y-1 bg-white p-3 rounded-2xl border border-warm-200 shadow-warm-sm">
                <strong className="text-espresso-900 block font-semibold">3. Mind Power Yoga:</strong>
                <span className="text-[11px] leading-relaxed block">Mental resilience and breathwork to dissolve stress and revitalize inner balance.</span>
              </li>
            </ul>
          </div>

          {/* Location, Contact & Hours */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-espresso-900 tracking-wider uppercase">
              Bavdhan Clinic Schedule
            </h4>
            <div className="space-y-2.5 text-xs text-espresso-700">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed">
                  Shop No. B1, ABC Convenience Centre, beside Marigold Banquets, Bavdhan, Pune 411021
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-brand-600 shrink-0" />
                <span className="text-[11px]">
                  Plus Code: <strong className="text-espresso-900 font-mono">GQ46+FM Pune</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-600 shrink-0" />
                <a href="tel:+919270113112" className="hover:text-brand-600 font-bold font-mono">
                  +91 92701 13112
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-600 shrink-0" />
                <a href="mailto:drmeghahomoeoclinic@gmail.com" className="hover:text-brand-600 text-[11px]">
                  drmeghahomoeoclinic@gmail.com
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-brand-600 shrink-0" />
                <a
                  href="https://www.instagram.com/dr.megha_bobde/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-600 text-[11px]"
                >
                  @dr.megha_bobde
                </a>
              </div>

              <div className="pt-2 border-t border-warm-200/80 space-y-1.5">
                <div className="flex items-center gap-1.5 text-espresso-800 font-semibold text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-sage-600" />
                  <span>Google Maps Verified Schedule:</span>
                </div>
                <div className="text-[11px] space-y-0.5 bg-white p-2.5 rounded-xl border border-warm-200">
                  <p className="text-brand-700 font-semibold">
                    Mon – Sat: 10:30 AM – 1:30 PM & 6:00 – 8:30 PM
                  </p>
                  <p className="text-sage-700 font-medium">
                    Sunday: 11:00 AM – 1:30 PM (Morning Only)
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-warm-200 text-center sm:flex sm:justify-between sm:items-center text-xs text-espresso-500">
          <p>
            &copy; {new Date().getFullYear()} Dr. Megha Bobde's Homoeo Clinic (डॉ. मेघा बोबडे 'स होम्यो क्लिनिक). All rights reserved.
          </p>
          <p className="mt-2 sm:mt-0 text-[11px]">
            Classical Homoeopathy · YFE Therapy · Mind Power Yoga · Bavdhan, Pune
          </p>
        </div>
      </div>
    </footer>
  );
}
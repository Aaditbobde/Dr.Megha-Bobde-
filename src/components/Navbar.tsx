'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, MessageSquare, Menu, X, Calendar, Star, Sparkles, Instagram } from 'lucide-react';
import LiveStatusBadge from './LiveStatusBadge';
import AppointmentBookingModal from './AppointmentBookingModal';
import Logo from './Logo';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const pathname = usePathname();

  // Handle scroll shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Doctor', href: '/about' },
    { label: 'Treatments & Care', href: '/services' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Patient Reviews', href: '/testimonials' },
    { label: 'Health Blog', href: '/blog' },
    { label: 'Contact & Map', href: '/contact' },
  ];

  return (
    <>
      {/* Top Notification Bar - Hidden on small mobile screens to conserve vertical viewport */}
      <div className="bg-espresso-950 text-cream-100 text-xs py-1.5 px-4 hidden md:block border-b border-espresso-900/60">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3.5">
            <span className="flex items-center gap-1.5 text-cream-200/90 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-sage-400"></span>
              Dr. Megha Abhijit Bobde — MD (Mumbai), BHMS · Bavdhan, Pune
            </span>
            <span className="text-espresso-700">|</span>
            <span className="flex items-center gap-1 text-amber-300 font-medium">
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              5.0 Stars (62 Google Reviews)
            </span>
            <span className="text-espresso-700">|</span>
            <span className="inline-flex items-center gap-1 text-brand-200 text-xs bg-brand-950/40 px-2.5 py-0.5 rounded-full border border-brand-800/40 font-medium">
              <Sparkles className="w-3 h-3 text-brand-400" />
              Boutique Classical Homoeopathy
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a
              href="tel:+919270113112"
              className="flex items-center gap-1 text-cream-100 hover:text-brand-300 font-semibold transition-colors py-1"
            >
              <Phone className="w-3.5 h-3.5 text-brand-400" />
              +91 92701 13112
            </a>
            <a
              href="https://api.whatsapp.com/send/?phone=919270113112&text=Hello%20Dr.%20Megha,%20I%20would%20like%20to%20inquire%20about%20a%20consultation."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sage-300 hover:text-sage-200 font-semibold transition-colors py-1"
            >
              <MessageSquare className="w-3.5 h-3.5 text-sage-400" />
              WhatsApp
            </a>
            <a
              href="https://www.instagram.com/dr.megha_bobde/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-cream-200 hover:text-brand-300 font-medium transition-colors py-1"
              title="Dr. Megha Bobde on Instagram"
            >
              <Instagram className="w-3.5 h-3.5 text-brand-400" />
              Instagram
            </a>
            <Link
              href="/admin/login"
              className="text-cream-300/70 hover:text-white underline ml-1 py-1"
            >
              Doctor CMS
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FDFBF7]/95 backdrop-blur-md shadow-warm-sm border-b border-warm-200/80 py-2 sm:py-2.5'
            : 'bg-[#FDFBF7] border-b border-warm-200/60 py-2.5 sm:py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Authentic Brand Logo Lockup */}
          <Logo variant="header" />

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all relative ${
                    isActive
                      ? 'text-brand-700 font-bold'
                      : 'text-espresso-800 hover:text-brand-600'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="block w-1.5 h-1.5 rounded-full bg-brand-600 mx-auto mt-0.5 animate-in fade-in" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Area (Tablet / Desktop) */}
          <div className="hidden sm:flex items-center gap-3">
            <LiveStatusBadge />

            <button
              onClick={() => setBookingOpen(true)}
              className="pill-btn min-h-[44px] px-5 py-2.5 text-sm bg-brand-600 hover:bg-brand-700 text-white shadow-brand-lift transition-all flex items-center gap-2 font-semibold"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Consultation</span>
            </button>
          </div>

          {/* Mobile Right Controls: Status badge + Hamburger (Min 44x44px touch target) */}
          <div className="flex items-center gap-2 lg:hidden">
            <LiveStatusBadge className="sm:hidden text-xs" showDetails={false} />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-2xl text-espresso-900 hover:bg-warm-100/80 active:bg-warm-200 transition-colors focus:outline-none"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-7 h-7 text-espresso-900" /> : <Menu className="w-7 h-7 text-espresso-900" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Backdrop & Drawer */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop overlay - tapping anywhere closes the menu */}
            <div
              className="fixed inset-0 top-[60px] sm:top-[70px] z-30 bg-espresso-950/50 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Slide-down Drawer */}
            <div className="relative z-40 lg:hidden border-t border-warm-200 bg-[#FDFBF7] px-4 pt-3 pb-6 space-y-3 shadow-warm-lg max-h-[calc(100vh-70px)] overflow-y-auto animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between py-2 border-b border-warm-200/60">
                <span className="text-xs font-bold text-espresso-700 uppercase tracking-wider">
                  Clinic Status & Hours
                </span>
                <LiveStatusBadge showDetails={true} />
              </div>

              {/* Mobile Navigation Links (Large 44px+ tap targets) */}
              <nav className="space-y-1 py-1" aria-label="Mobile Navigation">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`min-h-[48px] flex items-center justify-between px-4 py-3 rounded-2xl text-base font-semibold transition-colors ${
                        isActive
                          ? 'bg-brand-50 text-brand-800 font-bold border border-brand-200/60'
                          : 'text-espresso-900 hover:bg-warm-100/70 active:bg-warm-200/60'
                      }`}
                    >
                      <span>{link.label}</span>
                      {isActive ? (
                        <span className="w-2 h-2 rounded-full bg-brand-600" />
                      ) : (
                        <span className="text-espresso-400 text-xs">&rarr;</span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Call-to-action buttons in mobile drawer (Large tap targets) */}
              <div className="pt-2 border-t border-warm-200/60 flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setBookingOpen(true);
                  }}
                  className="w-full min-h-[48px] pill-btn py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-base shadow-brand-lift flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Consultation</span>
                </button>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <a
                    href="tel:+919270113112"
                    className="min-h-[44px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-full border border-warm-300 text-espresso-900 font-semibold text-sm bg-white hover:bg-warm-50 active:bg-warm-100 transition-colors shadow-warm-sm"
                  >
                    <Phone className="w-4 h-4 text-brand-600" />
                    <span>Call Clinic</span>
                  </a>
                  <a
                    href="https://api.whatsapp.com/send/?phone=919270113112&text=Hello%20Dr.%20Megha,%20I%20would%20like%20to%20consult%20at%20your%20Bavdhan%20clinic."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-full border border-sage-300 text-sage-900 font-semibold text-sm bg-sage-50 hover:bg-sage-100 active:bg-sage-200 transition-colors shadow-warm-sm"
                  >
                    <MessageSquare className="w-4 h-4 text-sage-700" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </header>

      {/* Appointment Booking Modal */}
      <AppointmentBookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </>
  );
}
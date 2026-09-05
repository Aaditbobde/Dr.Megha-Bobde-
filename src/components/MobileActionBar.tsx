'use client';

import React, { useState } from 'react';
import { Phone, MessageSquare, Calendar } from 'lucide-react';
import AppointmentBookingModal from './AppointmentBookingModal';

export default function MobileActionBar() {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <>
      <div 
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-t border-warm-300/80 p-2 sm:hidden shadow-[0_-4px_20px_rgba(43,36,32,0.12)]"
        role="region"
        aria-label="Quick Mobile Actions"
      >
        <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
          {/* Call button (RFC 3966 click-to-call) */}
          <a
            href="tel:+919270113112"
            className="min-h-[52px] flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl bg-white border border-warm-200 text-espresso-950 font-bold text-xs active:scale-95 transition-all shadow-warm-sm hover:bg-warm-50"
            aria-label="Call Dr. Megha Bobde's Clinic directly"
          >
            <Phone className="w-4 h-4 text-brand-600 mb-0.5" />
            <span className="leading-tight">Call Doctor</span>
          </a>

          {/* WhatsApp direct chat button */}
          <a
            href="https://api.whatsapp.com/send/?phone=919270113112&text=Hello%20Dr.%20Megha,%20I%20would%20like%20to%20consult%20at%20your%20Bavdhan%20clinic."
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[52px] flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl bg-sage-50 text-sage-900 border border-sage-200 font-bold text-xs active:scale-95 transition-all shadow-warm-sm hover:bg-sage-100"
            aria-label="Message Dr. Megha Bobde on WhatsApp"
          >
            <MessageSquare className="w-4 h-4 text-sage-700 mb-0.5" />
            <span className="leading-tight">WhatsApp</span>
          </a>

          {/* Book Consultation modal button */}
          <button
            onClick={() => setBookingOpen(true)}
            className="min-h-[52px] flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl bg-brand-600 text-white font-bold text-xs shadow-brand-lift active:scale-95 transition-all hover:bg-brand-700"
            aria-label="Book a consultation appointment"
          >
            <Calendar className="w-4 h-4 mb-0.5 text-white" />
            <span className="leading-tight">Book Visit</span>
          </button>
        </div>
      </div>

      <AppointmentBookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </>
  );
}
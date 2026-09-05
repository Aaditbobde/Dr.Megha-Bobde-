'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Navigation, 
  MessageSquare, 
  Send, 
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Instagram,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import LiveStatusBadge from '@/components/LiveStatusBadge';
import BrandWatermark from '@/components/BrandWatermark';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Consultation Inquiry');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Mobile map scroll trap prevention state
  const [mapActive, setMapActive] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, subject, message }),
      });

      if (!res.ok) {
        const d = await res.json();
        setError(d.error || 'Failed to submit inquiry.');
        return;
      }

      setSuccess(true);
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setError('Network error. Please call +91 92701 13112 or message directly on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-10 sm:py-20 text-espresso-950 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-200/60 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            Get In Touch
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso-950 tracking-tight">
            Contact & Clinic Directions
          </h1>
          <p className="font-devanagari text-brand-700 text-sm sm:text-base font-medium">
            डॉ. मेघा बोबडे यांच्या बावधन क्लिनिकशी थेट संपर्क साधा
          </p>
          <p className="text-sm sm:text-base text-espresso-600 leading-relaxed max-w-2xl mx-auto">
            Visit Dr. Megha Bobde's Homoeo Clinic in Bavdhan, Pune during morning or evening clinic hours, or reach out for remote vibrational therapy and consultations.
          </p>
          <div className="pt-2">
            <LiveStatusBadge showDetails={true} className="mx-auto" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Contact Details & Hours Card */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="boutique-card p-6 sm:p-8 bg-white space-y-6 text-xs text-espresso-600 relative overflow-hidden">
              <BrandWatermark className="opacity-[0.03] -right-12 -top-12 w-64 h-64" />

              <h3 className="font-serif font-bold text-xl text-espresso-950 border-b border-tan-100 pb-3">
                Clinic Coordinates
              </h3>

              <div className="space-y-4 relative z-10">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 border border-brand-200/60 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-espresso-950 block text-sm mb-0.5">Bavdhan Clinic Address:</strong>
                    <span className="leading-relaxed text-xs sm:text-sm">Shop No. B1, ABC Convenience Centre, beside Marigold Banquets, Bavdhan, Pune, Maharashtra 411021</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 border border-brand-200/60 flex items-center justify-center shrink-0 mt-0.5">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-espresso-950 block text-sm mb-0.5">Google Plus Code:</strong>
                    <span className="font-mono text-espresso-800 text-xs sm:text-sm">GQ46+FM Pune, Maharashtra</span>
                    <a
                      href="https://maps.google.com/?q=GQ46%2BFM+Pune,+Maharashtra"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] text-brand-700 hover:text-brand-900 font-bold block mt-1 inline-flex items-center gap-1.5 text-xs sm:text-sm underline"
                    >
                      Open in Maps App <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-sage-50 text-sage-700 border border-sage-200/60 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-espresso-950 block text-sm mb-0.5">Phone (Click to Call):</strong>
                    <a
                      href="tel:+919270113112"
                      className="min-h-[44px] inline-flex items-center text-brand-700 hover:text-brand-900 font-bold text-base font-mono tracking-wide underline"
                    >
                      +91 92701 13112
                    </a>
                    <span className="text-xs text-espresso-400 block mt-0.5">
                      Direct clinic helpline for appointments & inquiries
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-sage-50 text-sage-700 border border-sage-200/60 flex items-center justify-center shrink-0 mt-0.5">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-espresso-950 block text-sm mb-0.5">WhatsApp Direct Chat:</strong>
                    <a
                      href="https://api.whatsapp.com/send/?phone=919270113112&text=Hello%20Dr.%20Megha,%20I%20have%20an%20inquiry%20regarding%20an%20appointment."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] inline-flex items-center text-sage-800 font-bold hover:underline text-sm sm:text-base"
                    >
                      +91 92701 13112 (Instant Message)
                    </a>
                    <span className="text-xs text-espresso-400 block mt-0.5">
                      Quick appointment confirmations & reports
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-cream-100 text-espresso-700 border border-tan-200 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-espresso-950 block text-sm mb-0.5">Clinic Email:</strong>
                    <a
                      href="mailto:drmeghahomoeoclinic@gmail.com"
                      className="text-espresso-800 font-medium hover:underline text-xs sm:text-sm break-all"
                    >
                      drmeghahomoeoclinic@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-700 border border-pink-200/60 flex items-center justify-center shrink-0 mt-0.5">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-espresso-950 block text-sm mb-0.5">Instagram:</strong>
                    <a
                      href="https://www.instagram.com/dr.megha_bobde/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-700 font-semibold hover:underline inline-flex items-center gap-1 text-xs sm:text-sm py-1"
                    >
                      @dr.megha_bobde <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <span className="text-xs text-espresso-400 block mt-0.5">
                      Follow for holistic wellness insights & clinical tips
                    </span>
                  </div>
                </div>
              </div>

              {/* Weekly Schedule */}
              <div className="pt-5 border-t border-tan-100 space-y-3 relative z-10">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-600" />
                  <strong className="text-espresso-950 text-base font-serif">Weekly Clinic Schedule</strong>
                </div>

                <div className="bg-[#FAF6F0] p-4 rounded-2xl space-y-2.5 text-xs sm:text-sm border border-tan-200">
                  <div className="flex justify-between items-center py-1 border-b border-tan-200/60">
                    <span className="font-semibold text-espresso-900">Monday – Saturday</span>
                    <div className="text-right">
                      <span className="text-sage-800 font-bold block">10:30 AM – 1:30 PM</span>
                      <span className="text-sage-800 font-bold block">6:00 PM – 8:30 PM</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <div>
                      <span className="font-semibold text-espresso-900 block">Sunday</span>
                      <span className="text-xs text-espresso-500">Morning Session Only</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sage-800 font-bold block">11:00 AM – 1:30 PM</span>
                      <span className="text-brand-700 font-medium text-xs block">Evening: Closed</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-espresso-500 italic">
                  *Afternoon break: 1:30 PM to 6:00 PM. Prior appointment recommended for comprehensive case analysis.
                </p>
              </div>

              {/* Note on Women-Owned Practice */}
              <div className="pt-3 border-t border-tan-100 flex items-center gap-2.5 text-xs text-espresso-600 relative z-10">
                <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
                <span>Women-owned holistic medical practice led by Dr. Megha Abhijit Bobde (MD, BHMS).</span>
              </div>

            </div>

          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7 boutique-card p-6 sm:p-10 bg-white">
            <h3 className="font-serif font-bold text-2xl text-espresso-950 mb-2">
              Send a Message to the Clinic
            </h3>
            <p className="text-sm text-espresso-600 mb-6 leading-relaxed">
              Have questions regarding treatment duration, case history, or appointment slots? Fill out the form below and Dr. Megha's team will respond promptly.
            </p>

            {success ? (
              <div className="text-center py-10 space-y-4 bg-sage-50/60 rounded-3xl border border-sage-200 p-8">
                <div className="w-16 h-16 rounded-full bg-sage-100 text-sage-700 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h4 className="font-serif font-bold text-xl text-espresso-950">
                  Message Received with Thanks!
                </h4>
                <p className="text-sm text-espresso-700 max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out. Dr. Megha Bobde's clinic team will contact you shortly on your provided phone or email.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="pill-btn min-h-[44px] mt-4 px-6 py-2.5 bg-brand-600 text-white rounded-full text-sm font-semibold hover:bg-brand-700 shadow-md shadow-brand-500/20"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                {error && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-2 text-xs sm:text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-espresso-800 block mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      autoComplete="name"
                      placeholder="e.g. Anand Kulkarni"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full min-h-[48px] px-4 py-3 border border-tan-200 rounded-xl text-base text-espresso-900 placeholder:text-espresso-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-espresso-800 block mb-1">
                      Mobile Phone Number *
                    </label>
                    <input
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9+ ]/g, ''))}
                      className="w-full min-h-[48px] px-4 py-3 border border-tan-200 rounded-xl text-base text-espresso-900 placeholder:text-espresso-400 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-espresso-800 block mb-1">
                      Email Address (optional)
                    </label>
                    <input
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="you@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full min-h-[48px] px-4 py-3 border border-tan-200 rounded-xl text-base text-espresso-900 placeholder:text-espresso-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-espresso-800 block mb-1">
                      Subject / Treatment Area
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full min-h-[48px] px-4 py-3 border border-tan-200 rounded-xl text-base text-espresso-900 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                    >
                      <option value="Consultation Inquiry">General Consultation Inquiry</option>
                      <option value="Classical Homoeopathy">Classical Homoeopathy & Chronic Illness</option>
                      <option value="Yogananda Flower Essences">Yogananda Flower Essences (YFE)</option>
                      <option value="Mind Power Yoga">Mind Power Yoga & Holistic Guidance</option>
                      <option value="Skin & Allergies">Skin & Allergies (Eczema, Psoriasis, Urticaria)</option>
                      <option value="Women's Health / PCOS">Women's Health (PCOS, Menopause, Hormones)</option>
                      <option value="Pediatric Care">Pediatric Child Health & Immunity</option>
                      <option value="Appointment Booking">Appointment Scheduling</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-espresso-800 block mb-1">
                    Your Message / Query *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us what you would like to know or discuss..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 border border-tan-200 rounded-xl text-base text-espresso-900 placeholder:text-espresso-400 focus:outline-none focus:ring-2 focus:ring-brand-500 leading-relaxed"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="pill-btn w-full min-h-[50px] py-3.5 px-6 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-base shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending Message...' : 'Send Clinic Message'}</span>
                </button>
              </form>
            )}

          </div>

        </div>

        {/* Embedded Google Map Section with Mobile Scroll-Trap Prevention */}
        <div className="mt-12 sm:mt-14 boutique-card p-5 sm:p-8 bg-white space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-serif font-bold text-xl text-espresso-950">
                Clinic Location Map · Bavdhan, Pune
              </h3>
              <p className="text-xs sm:text-sm text-espresso-500">
                Centering on Plus Code: <strong className="text-espresso-800 font-mono">GQ46+FM Pune, Maharashtra</strong> (Beside Marigold Banquets)
              </p>
            </div>
            <a
              href="https://maps.google.com/?q=GQ46%2BFM+Pune,+Maharashtra"
              target="_blank"
              rel="noopener noreferrer"
              className="pill-btn min-h-[44px] inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-200/80 rounded-full transition-colors w-full sm:w-auto justify-center"
            >
              <Navigation className="w-4 h-4 text-brand-600" />
              <span>Get Driving Directions</span>
            </a>
          </div>

          {/* Map Frame Container with touch scroll trap protection */}
          <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-tan-200 relative bg-tan-50">
            {/* Mobile Interaction Guard: prevents accidental scroll trapping */}
            {!mapActive && (
              <div 
                onClick={() => setMapActive(true)}
                className="sm:hidden absolute inset-0 z-20 bg-espresso-950/15 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2 cursor-pointer p-4 text-center"
                role="button"
                tabIndex={0}
                aria-label="Tap to enable map interaction on phone"
              >
                <div className="pill-btn px-4 py-2.5 bg-espresso-950/90 text-white text-xs font-semibold shadow-xl flex items-center gap-2 border border-white/20">
                  <Navigation className="w-3.5 h-3.5 text-brand-400" />
                  <span>Tap to interact with map</span>
                </div>
                <span className="text-[11px] text-white font-medium bg-black/50 px-2.5 py-0.5 rounded-full">
                  Swipe outside map to continue scrolling page
                </span>
              </div>
            )}

            {mapActive && (
              <button
                onClick={() => setMapActive(false)}
                className="sm:hidden absolute top-3 right-3 z-30 pill-btn px-3 py-1.5 bg-espresso-950/90 text-white text-xs font-semibold shadow-md border border-white/20 flex items-center gap-1"
              >
                <span>Done / Resume Page Scroll</span>
              </button>
            )}

            <iframe
              title="Dr. Megha Bobde's Homoeo Clinic Location Map"
              src="https://maps.google.com/maps?q=GQ46%2BFM+Pune,+Maharashtra&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className={mapActive ? 'pointer-events-auto' : 'pointer-events-none sm:pointer-events-auto'}
            ></iframe>
          </div>
        </div>

      </div>
    </div>
  );
}
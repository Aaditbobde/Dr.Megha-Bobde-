'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calendar, Clock, User, Phone, Mail, FileText, CheckCircle2, AlertCircle, MessageSquare, Sparkles } from 'lucide-react';
import { formatTime12 } from '@/lib/hours-helper';
import LiveStatusBadge from '@/components/LiveStatusBadge';
import BrandWatermark from '@/components/BrandWatermark';

function BookAppointmentForm() {
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get('service');

  const getTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [date, setDate] = useState<string>(getTomorrowDate());
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isDayClosed, setIsDayClosed] = useState<boolean>(false);
  const [dayName, setDayName] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);

  // Form Fields
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Female');
  const [consultationType, setConsultationType] = useState('IN_CLINIC');
  const [treatmentType, setTreatmentType] = useState('HOMOEOPATHY');
  const [reason, setReason] = useState(preselectedService ? `Consultation for ${preselectedService}` : '');

  const [submitting, setSubmitting] = useState(false);
  const [conflictError, setConflictError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    appointment: any;
    patientWhatsAppUrl: string;
  } | null>(null);

  useEffect(() => {
    if (preselectedService) {
      setReason(`Consultation for ${preselectedService}`);
      if (preselectedService.toLowerCase().includes('flower') || preselectedService.toLowerCase().includes('yfe')) {
        setTreatmentType('YFE_THERAPY');
      } else if (preselectedService.toLowerCase().includes('yoga')) {
        setTreatmentType('MIND_POWER_YOGA');
      }
    }
  }, [preselectedService]);

  useEffect(() => {
    if (!date) return;

    async function fetchSlots() {
      setLoadingSlots(true);
      setConflictError(null);
      setSelectedSlot('');
      try {
        const res = await fetch(`/api/appointments?date=${date}&checkSlots=true`);
        if (res.ok) {
          const data = await res.json();
          setIsDayClosed(data.isClosed);
          setDayName(data.dayName);
          setAvailableSlots(data.availableSlots || []);
        }
      } catch (err) {
        console.error('Failed to load slots', err);
      } finally {
        setLoadingSlots(false);
      }
    }

    fetchSlots();
  }, [date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConflictError(null);

    if (!selectedSlot) {
      setConflictError('Please choose an available consultation time slot.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName,
          phone,
          email,
          age: age ? parseInt(age, 10) : undefined,
          gender,
          appointmentDate: date,
          timeSlot: selectedSlot,
          consultationType,
          treatmentType,
          reason,
        }),
      });

      const data = await res.json();

      if (res.status === 409) {
        setConflictError(data.error || 'This slot was just booked by another patient. Please select a different time slot.');
        const reloadRes = await fetch(`/api/appointments?date=${date}&checkSlots=true`);
        if (reloadRes.ok) {
          const reloadData = await reloadRes.json();
          setAvailableSlots(reloadData.availableSlots || []);
        }
        return;
      }

      if (!res.ok) {
        setConflictError(data.error || 'Failed to schedule appointment.');
        return;
      }

      setSuccessData(data);
    } catch (err) {
      setConflictError('Network error. Please call +91 92701 13112 or reach out on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBookAnother = () => {
    setSuccessData(null);
    setSelectedSlot('');
    setPatientName('');
    setPhone('');
    setReason('');
  };

  const morningSlots = availableSlots.filter((s) => {
    const [h] = s.split(':').map(Number);
    return h < 14;
  });

  const eveningSlots = availableSlots.filter((s) => {
    const [h] = s.split(':').map(Number);
    return h >= 14;
  });

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-10 sm:py-20 text-espresso-950 overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-200/60 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            Online Appointment Booking
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso-950 tracking-tight">
            Schedule a Consultation
          </h1>
          <p className="font-devanagari text-brand-700 text-sm sm:text-base font-medium">
            डॉ. मेघा बोबडे यांच्यासोबत अपॉइंटमेंट बुक करा
          </p>
          <p className="text-sm text-espresso-600 max-w-lg mx-auto leading-relaxed">
            Reserve an in-clinic consultation at our Bavdhan clinic or an online session with <strong>Dr. Megha Abhijit Bobde (MD, BHMS)</strong>.
          </p>
        </div>

        {successData ? (
          <div className="boutique-card bg-white p-6 sm:p-12 text-center space-y-6 relative overflow-hidden">
            <BrandWatermark className="opacity-[0.03] -right-16 -top-16 w-80 h-80" />

            <div className="w-16 h-16 bg-sage-100 text-sage-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-espresso-950">
              Appointment Successfully Reserved!
            </h2>
            <p className="text-sm sm:text-base text-espresso-600 max-w-md mx-auto leading-relaxed">
              Thank you, <strong className="text-espresso-950">{successData.appointment.patientName}</strong>. Your consultation has been scheduled with Dr. Megha Bobde.
            </p>

            <div className="bg-[#FAF6F0] border border-tan-200 rounded-2xl p-4 sm:p-5 max-w-md mx-auto text-left text-xs sm:text-sm space-y-2.5">
              <div className="flex justify-between">
                <span className="text-espresso-500">Date:</span>
                <span className="font-bold text-espresso-900">{successData.appointment.appointmentDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-espresso-500">Time Slot:</span>
                <span className="font-bold text-brand-700">{formatTime12(successData.appointment.timeSlot)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-espresso-500">Modality:</span>
                <span className="font-semibold text-espresso-800">
                  {successData.appointment.treatmentType === 'YFE_THERAPY'
                    ? 'Yogananda Flower Essences Therapy'
                    : successData.appointment.treatmentType === 'MIND_POWER_YOGA'
                    ? 'Mind Power Yoga Session'
                    : 'Classical / Advanced Homeopathy'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-espresso-500">Mode:</span>
                <span className="font-semibold text-espresso-800">
                  {successData.appointment.consultationType === 'IN_CLINIC'
                    ? 'In-Clinic (Bavdhan, Pune)'
                    : 'Online / Remote Video Session'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-espresso-500">Phone:</span>
                <span className="font-semibold text-espresso-800">{successData.appointment.phone}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={successData.patientWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pill-btn min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Notify Dr. Megha on WhatsApp</span>
              </a>

              <button
                onClick={handleBookAnother}
                className="pill-btn min-h-[48px] inline-flex items-center justify-center px-6 py-3 rounded-full border border-tan-300 bg-white hover:bg-tan-50 text-espresso-800 font-semibold text-sm transition-all"
              >
                Book Another Appointment
              </button>
            </div>
          </div>
        ) : (
          <div className="boutique-card bg-white p-5 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {conflictError && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  <span>{conflictError}</span>
                </div>
              )}

              {/* 1. Modality Selection */}
              <div>
                <label className="text-xs font-bold text-espresso-800 uppercase tracking-wider block mb-2">
                  1. Select Healing Modality
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setTreatmentType('HOMOEOPATHY')}
                    className={`min-h-[56px] py-3 px-4 rounded-2xl border text-left transition-all ${
                      treatmentType === 'HOMOEOPATHY'
                        ? 'border-brand-600 bg-brand-50/80 text-brand-950 font-semibold ring-2 ring-brand-500/30 shadow-sm'
                        : 'border-tan-200 bg-white hover:border-brand-300 text-espresso-700 active:bg-tan-50'
                    }`}
                  >
                    <span className="block font-serif font-bold text-sm sm:text-base">Classical Homeopathy</span>
                    <span className="text-xs text-espresso-500">Root constitutional care</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTreatmentType('YFE_THERAPY')}
                    className={`min-h-[56px] py-3 px-4 rounded-2xl border text-left transition-all ${
                      treatmentType === 'YFE_THERAPY'
                        ? 'border-brand-600 bg-brand-50/80 text-brand-950 font-semibold ring-2 ring-brand-500/30 shadow-sm'
                        : 'border-tan-200 bg-white hover:border-brand-300 text-espresso-700 active:bg-tan-50'
                    }`}
                  >
                    <span className="block font-serif font-bold text-sm sm:text-base">YFE Therapy</span>
                    <span className="text-xs text-espresso-500">Flower essences & affirmations</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTreatmentType('MIND_POWER_YOGA')}
                    className={`min-h-[56px] py-3 px-4 rounded-2xl border text-left transition-all ${
                      treatmentType === 'MIND_POWER_YOGA'
                        ? 'border-brand-600 bg-brand-50/80 text-brand-950 font-semibold ring-2 ring-brand-500/30 shadow-sm'
                        : 'border-tan-200 bg-white hover:border-brand-300 text-espresso-700 active:bg-tan-50'
                    }`}
                  >
                    <span className="block font-serif font-bold text-sm sm:text-base">Mind Power Yoga</span>
                    <span className="text-xs text-espresso-500">Pranic breathwork & poise</span>
                  </button>
                </div>
              </div>

              {/* 2. Consultation Mode */}
              <div>
                <label className="text-xs font-bold text-espresso-800 uppercase tracking-wider block mb-2">
                  2. Consultation Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setConsultationType('IN_CLINIC')}
                    className={`min-h-[48px] py-3 px-4 rounded-2xl border text-center transition-all ${
                      consultationType === 'IN_CLINIC'
                        ? 'border-brand-600 bg-brand-50/80 text-brand-950 font-bold ring-2 ring-brand-500/30 shadow-sm'
                        : 'border-tan-200 bg-white hover:border-brand-300 text-espresso-800'
                    }`}
                  >
                    🏥 In-Clinic Visit (Bavdhan, Pune)
                  </button>
                  <button
                    type="button"
                    onClick={() => setConsultationType('ONLINE')}
                    className={`min-h-[48px] py-3 px-4 rounded-2xl border text-center transition-all ${
                      consultationType === 'ONLINE'
                        ? 'border-brand-600 bg-brand-50/80 text-brand-950 font-bold ring-2 ring-brand-500/30 shadow-sm'
                        : 'border-tan-200 bg-white hover:border-brand-300 text-espresso-800'
                    }`}
                  >
                    💻 Online / Remote Video Session
                  </button>
                </div>
              </div>

              {/* 3. Date Selection */}
              <div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-1.5">
                  <label className="text-xs font-bold text-espresso-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-brand-600" />
                    3. Choose Consultation Date
                  </label>
                  <span className="text-xs text-espresso-500">
                    Mon–Sat: 10:30–1:30 & 6:00–8:30 | Sun: 11:00–1:30
                  </span>
                </div>
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full min-h-[48px] px-4 py-3 border border-tan-200 rounded-xl text-base text-espresso-900 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white font-mono"
                  required
                />
              </div>

              {/* 4. Available Slots */}
              <div>
                <label className="text-xs font-bold text-espresso-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Clock className="w-4 h-4 text-brand-600" />
                  4. Select Consultation Time Slot
                </label>

                {loadingSlots ? (
                  <div className="py-8 text-center text-sm text-espresso-500 animate-pulse bg-tan-50 rounded-2xl border border-tan-200">
                    Checking slot availability for {date}...
                  </div>
                ) : isDayClosed ? (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center text-sm text-amber-900 font-medium">
                    The clinic is closed on <strong>{dayName}</strong>. Please select another date.
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="p-4 bg-[#FAF6F0] border border-tan-200 rounded-2xl text-center text-sm text-espresso-600">
                    All slots for this date are booked. Please pick another date or call <a href="tel:+919270113112" className="text-brand-700 font-bold hover:underline">+91 92701 13112</a>.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {morningSlots.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-espresso-700 block">
                          Morning Session (10:30 AM – 1:30 PM):
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                          {morningSlots.map((slot) => {
                            const isSelected = selectedSlot === slot;
                            return (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => setSelectedSlot(slot)}
                                className={`min-h-[44px] py-2 px-2 text-sm rounded-xl font-bold border transition-all flex items-center justify-center ${
                                  isSelected
                                    ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/20'
                                    : 'bg-[#FAF6F0] hover:bg-brand-50 text-espresso-800 border-tan-200 hover:border-brand-300 active:bg-brand-100'
                                }`}
                              >
                                {formatTime12(slot)}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {eveningSlots.length > 0 && (
                      <div className="space-y-2 pt-3 border-t border-tan-100">
                        <span className="text-xs font-bold text-espresso-700 block">
                          Evening Session (6:00 PM – 8:30 PM):
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                          {eveningSlots.map((slot) => {
                            const isSelected = selectedSlot === slot;
                            return (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => setSelectedSlot(slot)}
                                className={`min-h-[44px] py-2 px-2 text-sm rounded-xl font-bold border transition-all flex items-center justify-center ${
                                  isSelected
                                    ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/20'
                                    : 'bg-[#FAF6F0] hover:bg-brand-50 text-espresso-800 border-tan-200 hover:border-brand-300 active:bg-brand-100'
                                }`}
                              >
                                {formatTime12(slot)}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 5. Patient Information */}
              <div className="pt-5 border-t border-tan-100 space-y-4">
                <h4 className="text-xs font-bold text-espresso-800 uppercase tracking-wider">
                  5. Patient Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-espresso-700 font-bold block mb-1">
                      Patient Full Name *
                    </label>
                    <input
                      type="text"
                      autoComplete="name"
                      placeholder="e.g. Radhika Deshpande"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full min-h-[48px] px-4 py-3 border border-tan-200 rounded-xl text-base text-espresso-900 placeholder:text-espresso-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs text-espresso-700 font-bold block mb-1">
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-espresso-700 font-bold block mb-1">Age</label>
                    <input
                      type="number"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="e.g. 29"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full min-h-[48px] px-4 py-3 border border-tan-200 rounded-xl text-base text-espresso-900 placeholder:text-espresso-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-espresso-700 font-bold block mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full min-h-[48px] px-4 py-3 border border-tan-200 rounded-xl text-base text-espresso-900 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Child">Child</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-espresso-700 font-bold block mb-1">Email (optional)</label>
                    <input
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="patient@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full min-h-[48px] px-4 py-3 border border-tan-200 rounded-xl text-base text-espresso-900 placeholder:text-espresso-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-espresso-700 font-bold block mb-1">
                    Chief Complaints / Symptoms *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe main health concerns (e.g., chronic sinusitis, child tonsillitis, emotional stress, thyroid)"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-4 py-3 border border-tan-200 rounded-xl text-base text-espresso-900 placeholder:text-espresso-400 focus:outline-none focus:ring-2 focus:ring-brand-500 leading-relaxed"
                    required
                  ></textarea>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={submitting || isDayClosed || !selectedSlot}
                  className="pill-btn w-full min-h-[52px] py-4 px-6 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-base shadow-md shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    'Securing Consultation Slot...'
                  ) : (
                    <>
                      <Calendar className="w-5 h-5" />
                      <span>
                        Confirm Appointment {selectedSlot ? `(${formatTime12(selectedSlot)})` : ''}
                      </span>
                    </>
                  )}
                </button>
                <p className="text-xs text-espresso-500 text-center mt-2.5">
                  No advance online payment required. Standard consultation fees payable at session.
                </p>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-espresso-500 animate-pulse">Loading booking interface...</div>}>
      <BookAppointmentForm />
    </Suspense>
  );
}
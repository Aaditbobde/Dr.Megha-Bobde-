'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Phone, Mail, FileText, CheckCircle2, AlertCircle, MessageSquare, Sparkles } from 'lucide-react';
import { formatTime12 } from '@/lib/hours-helper';

interface AppointmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedDate?: string;
  preselectedService?: string;
}

export default function AppointmentBookingModal({
  isOpen,
  onClose,
  preselectedDate,
  preselectedService,
}: AppointmentBookingModalProps) {
  const getTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [date, setDate] = useState<string>(preselectedDate || getTomorrowDate());
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

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !date) return;

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
  }, [date, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConflictError(null);

    if (!selectedSlot) {
      setConflictError('Please select an available consultation slot.');
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

  const handleClose = () => {
    setSuccessData(null);
    setSelectedSlot('');
    setPatientName('');
    setPhone('');
    setReason('');
    setConflictError(null);
    onClose();
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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-espresso-950/70 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="relative w-full max-w-2xl bg-[#FDFBF7] rounded-3xl shadow-2xl overflow-hidden border border-tan-200 my-auto text-espresso-950 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-espresso-950 px-4 sm:px-6 py-3.5 text-white flex justify-between items-center border-b border-espresso-800 shrink-0">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-brand-300 font-semibold uppercase tracking-wider mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Dr. Megha Bobde's Homoeo Clinic</span>
            </div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-cream-100">
              Schedule Your Consultation
            </h3>
            <p className="text-xs text-espresso-300">
              Bavdhan, Pune · Mon–Sat: 10:30–1:30 & 6:00–8:30 | Sun: 11:00–1:30
            </p>
          </div>
          <button 
            onClick={handleClose} 
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-espresso-400 hover:text-white p-2 rounded-xl transition-colors focus:outline-none"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {successData ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-sage-100 text-sage-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="font-serif text-2xl font-bold text-espresso-950">
                Appointment Reserved Successfully!
              </h4>
              <p className="text-sm text-espresso-600 max-w-sm mx-auto leading-relaxed">
                Thank you, <strong className="text-espresso-900">{successData.appointment.patientName}</strong>. Your appointment has been secured.
              </p>

              <div className="bg-[#FAF6F0] border border-tan-200 rounded-2xl p-4 max-w-sm mx-auto text-left text-xs sm:text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-espresso-500">Date:</span>
                  <span className="font-bold text-espresso-900">{successData.appointment.appointmentDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-espresso-500">Time:</span>
                  <span className="font-bold text-brand-700">{formatTime12(successData.appointment.timeSlot)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-espresso-500">Mode:</span>
                  <span className="font-semibold text-espresso-800">
                    {successData.appointment.consultationType === 'IN_CLINIC'
                      ? 'In-Clinic (Bavdhan, Pune)'
                      : 'Online / Video Session'}
                  </span>
                </div>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row gap-2.5 justify-center">
                <a
                  href={successData.patientWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill-btn min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 text-sm font-semibold shadow-md"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Notify on WhatsApp</span>
                </a>
                <button
                  onClick={handleClose}
                  className="pill-btn min-h-[48px] px-6 py-2.5 rounded-full border border-tan-300 text-espresso-800 bg-white hover:bg-tan-50 text-sm font-semibold"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 text-xs sm:text-sm">
              {conflictError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-start gap-2 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  <span>{conflictError}</span>
                </div>
              )}

              {/* Modality Selection */}
              <div>
                <label className="font-bold text-espresso-800 block mb-1.5 uppercase tracking-wider text-xs">
                  1. Healing Modality
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTreatmentType('HOMOEOPATHY')}
                    className={`min-h-[48px] py-2.5 px-3 rounded-xl border text-left transition-all ${
                      treatmentType === 'HOMOEOPATHY'
                        ? 'border-brand-600 bg-brand-50/80 text-brand-950 font-bold ring-2 ring-brand-500/30'
                        : 'border-tan-200 bg-white hover:border-brand-300 text-espresso-700'
                    }`}
                  >
                    <span className="block font-medium">Homeopathy</span>
                    <span className="text-xs text-espresso-500">Root constitutional care</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTreatmentType('YFE_THERAPY')}
                    className={`min-h-[48px] py-2.5 px-3 rounded-xl border text-left transition-all ${
                      treatmentType === 'YFE_THERAPY'
                        ? 'border-brand-600 bg-brand-50/80 text-brand-950 font-bold ring-2 ring-brand-500/30'
                        : 'border-tan-200 bg-white hover:border-brand-300 text-espresso-700'
                    }`}
                  >
                    <span className="block font-medium">YFE Therapy</span>
                    <span className="text-xs text-espresso-500">Flower essences</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTreatmentType('MIND_POWER_YOGA')}
                    className={`min-h-[48px] py-2.5 px-3 rounded-xl border text-left transition-all ${
                      treatmentType === 'MIND_POWER_YOGA'
                        ? 'border-brand-600 bg-brand-50/80 text-brand-950 font-bold ring-2 ring-brand-500/30'
                        : 'border-tan-200 bg-white hover:border-brand-300 text-espresso-700'
                    }`}
                  >
                    <span className="block font-medium">Mind Power Yoga</span>
                    <span className="text-xs text-espresso-500">Pranic breathwork</span>
                  </button>
                </div>
              </div>

              {/* Mode & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-espresso-800 block mb-1 uppercase tracking-wider text-xs">
                    2. Consultation Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setConsultationType('IN_CLINIC')}
                      className={`min-h-[46px] py-2 px-2.5 rounded-xl border text-center transition-all ${
                        consultationType === 'IN_CLINIC'
                          ? 'border-brand-600 bg-brand-50/80 text-brand-950 font-bold ring-2 ring-brand-500/30'
                          : 'border-tan-200 bg-white text-espresso-700'
                      }`}
                    >
                      🏥 In-Clinic
                    </button>
                    <button
                      type="button"
                      onClick={() => setConsultationType('ONLINE')}
                      className={`min-h-[46px] py-2 px-2.5 rounded-xl border text-center transition-all ${
                        consultationType === 'ONLINE'
                          ? 'border-brand-600 bg-brand-50/80 text-brand-950 font-bold ring-2 ring-brand-500/30'
                          : 'border-tan-200 bg-white text-espresso-700'
                      }`}
                    >
                      💻 Online
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-espresso-800 block mb-1 uppercase tracking-wider text-xs">
                    3. Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full min-h-[46px] px-3.5 py-2 bg-white border border-tan-200 rounded-xl text-base text-espresso-900 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                    required
                  />
                </div>
              </div>

              {/* Slot Picker */}
              <div>
                <label className="font-bold text-espresso-800 block mb-1.5 uppercase tracking-wider text-xs">
                  4. Consultation Time Slot
                </label>
                {loadingSlots ? (
                  <div className="py-4 text-center text-xs text-espresso-500 animate-pulse bg-tan-50 rounded-xl border border-tan-200">
                    Checking available slots...
                  </div>
                ) : isDayClosed ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center text-xs text-amber-900 font-medium">
                    Clinic is closed on <strong>{dayName}</strong>. Please pick another day.
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="p-3 bg-[#FAF6F0] border border-tan-200 rounded-xl text-center text-xs text-espresso-600">
                    No slots remaining today. Please choose another date or call <a href="tel:+919270113112" className="text-brand-700 font-bold hover:underline">+91 92701 13112</a>.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {morningSlots.length > 0 && (
                      <div>
                        <span className="text-xs font-semibold text-espresso-600 block mb-1">
                          Morning (10:30 AM – 1:30 PM):
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {morningSlots.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setSelectedSlot(s)}
                              className={`min-h-[44px] py-2 px-2 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center justify-center ${
                                selectedSlot === s
                                  ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                                  : 'bg-[#FAF6F0] hover:bg-brand-50 border-tan-200 text-espresso-800 active:bg-brand-100'
                              }`}
                            >
                              {formatTime12(s)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {eveningSlots.length > 0 && (
                      <div className="pt-2 border-t border-tan-100">
                        <span className="text-xs font-semibold text-espresso-600 block mb-1">
                          Evening (6:00 PM – 8:30 PM):
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {eveningSlots.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setSelectedSlot(s)}
                              className={`min-h-[44px] py-2 px-2 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center justify-center ${
                                selectedSlot === s
                                  ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                                  : 'bg-[#FAF6F0] hover:bg-brand-50 border-tan-200 text-espresso-800 active:bg-brand-100'
                              }`}
                            >
                              {formatTime12(s)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Patient Inputs */}
              <div className="pt-3 border-t border-tan-100 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-espresso-800 block mb-1">
                      Patient Name *
                    </label>
                    <input
                      type="text"
                      autoComplete="name"
                      placeholder="e.g. Radhika Deshpande"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full min-h-[48px] px-3.5 py-2.5 bg-white border border-tan-200 rounded-xl text-base text-espresso-900 placeholder:text-espresso-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-espresso-800 block mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9+ ]/g, ''))}
                      className="w-full min-h-[48px] px-3.5 py-2.5 bg-white border border-tan-200 rounded-xl text-base text-espresso-900 placeholder:text-espresso-400 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div>
                    <label className="text-xs font-semibold text-espresso-800 block mb-1">Age</label>
                    <input
                      type="number"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="Age"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full min-h-[48px] px-3 py-2 bg-white border border-tan-200 rounded-xl text-base text-espresso-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-espresso-800 block mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full min-h-[48px] px-2 py-2 bg-white border border-tan-200 rounded-xl text-base text-espresso-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Child">Child</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-espresso-800 block mb-1">Email</label>
                    <input
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="Optional"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full min-h-[48px] px-3 py-2 bg-white border border-tan-200 rounded-xl text-base text-espresso-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-espresso-800 block mb-1">
                    Chief Health Concerns *
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of symptoms..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-tan-200 rounded-xl text-base text-espresso-900 placeholder:text-espresso-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || isDayClosed || !selectedSlot}
                className="pill-btn w-full min-h-[50px] py-3.5 px-4 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-base shadow-md shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mt-2"
              >
                {submitting ? (
                  'Reserving Consultation...'
                ) : (
                  <>
                    <Calendar className="w-5 h-5" />
                    <span>Confirm Consultation {selectedSlot ? `(${formatTime12(selectedSlot)})` : ''}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
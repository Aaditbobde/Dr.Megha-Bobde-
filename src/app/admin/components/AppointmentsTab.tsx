'use client';

import React from 'react';
import { MessageSquare, Trash2, Phone, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { formatTime12 } from '@/lib/hours-helper';

interface AppointmentsTabProps {
  appointments: any[];
  onUpdateStatus: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

export default function AppointmentsTab({
  appointments,
  onUpdateStatus,
  onDelete,
}: AppointmentsTabProps) {
  if (appointments.length === 0) {
    return (
      <div className="py-12 text-center text-espresso-500 text-sm bg-white rounded-3xl border border-tan-200">
        No appointments booked yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-tan-200 shadow-sm space-y-5">
      <div>
        <h3 className="font-serif font-bold text-lg sm:text-xl text-espresso-950">
          Scheduled Patient Consultations
        </h3>
        <p className="text-xs sm:text-sm text-espresso-600">
          Review, confirm, and manage clinic appointments and remote sessions.
        </p>
      </div>

      {/* Mobile Card Layout (Visible on Small Screens) */}
      <div className="block md:hidden space-y-3.5">
        {appointments.map((appt) => {
          const cleanPhone = appt.phone.replace(/[^0-9]/g, '');
          const whatsappUrl = `https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(appt.patientName)},%20confirming%20your%20appointment%20with%20Dr.%20Megha%20Bobde%20on%20${appt.appointmentDate}%20at%20${appt.timeSlot}.`;

          return (
            <div key={appt.id} className="p-4 rounded-2xl border border-tan-200 bg-[#FAF6F0] space-y-3 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-serif font-bold text-base text-espresso-950">{appt.patientName}</h4>
                  <span className="text-xs text-espresso-600 block">
                    {appt.age ? `${appt.age} yrs, ` : ''}{appt.gender || ''}
                  </span>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    appt.status === 'CONFIRMED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : appt.status === 'COMPLETED'
                      ? 'bg-blue-100 text-blue-800'
                      : appt.status === 'CANCELLED'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {appt.status}
                </span>
              </div>

              <div className="text-xs space-y-1 bg-white p-3 rounded-xl border border-tan-200">
                <div className="flex items-center justify-between font-semibold text-espresso-900">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-600" />
                    {appt.appointmentDate}
                  </span>
                  <span className="text-brand-700 font-bold">
                    {formatTime12(appt.timeSlot)}
                  </span>
                </div>
                <div className="text-[11px] text-espresso-600 pt-1 border-t border-tan-100">
                  <span className="font-semibold text-espresso-800">Mode: </span>
                  {appt.consultationType === 'IN_CLINIC' ? 'In-Clinic (Bavdhan)' : 'Online Video'}
                </div>
                {appt.reason && (
                  <div className="text-[11px] text-espresso-600">
                    <span className="font-semibold text-espresso-800">Complaints: </span>
                    {appt.reason}
                  </div>
                )}
              </div>

              {/* Action Buttons for Mobile (Min 44px height) */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`tel:${appt.phone}`}
                  className="min-h-[44px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-tan-300 text-espresso-900 font-semibold text-xs shadow-sm active:bg-tan-50"
                >
                  <Phone className="w-3.5 h-3.5 text-brand-600" />
                  <span>Call Patient</span>
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-semibold text-xs shadow-sm active:bg-emerald-100"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Status Update Actions */}
              <div className="flex items-center justify-between pt-1 border-t border-tan-200 text-xs">
                <div className="flex gap-2">
                  {appt.status !== 'CONFIRMED' && (
                    <button
                      onClick={() => onUpdateStatus(appt.id, 'CONFIRMED')}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white font-medium text-xs shadow-sm"
                    >
                      Confirm
                    </button>
                  )}
                  {appt.status !== 'COMPLETED' && (
                    <button
                      onClick={() => onUpdateStatus(appt.id, 'COMPLETED')}
                      className="px-2.5 py-1.5 rounded-lg bg-tan-200 text-espresso-800 font-medium text-xs hover:bg-tan-300"
                    >
                      Complete
                    </button>
                  )}
                  {appt.status !== 'CANCELLED' && (
                    <button
                      onClick={() => onUpdateStatus(appt.id, 'CANCELLED')}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 font-medium text-xs"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                <button
                  onClick={() => onDelete(appt.id)}
                  className="p-2 rounded-lg text-espresso-400 hover:text-rose-600"
                  aria-label="Delete appointment"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop / Tablet Table Layout */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-tan-200 text-espresso-600 font-semibold uppercase tracking-wider text-[11px] bg-[#FAF6F0]">
              <th className="py-3.5 px-4">Date & Slot</th>
              <th className="py-3.5 px-4">Patient Name</th>
              <th className="py-3.5 px-4">Contact</th>
              <th className="py-3.5 px-4">Mode</th>
              <th className="py-3.5 px-4">Chief Complaint</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-tan-100">
            {appointments.map((appt) => {
              const cleanPhone = appt.phone.replace(/[^0-9]/g, '');
              const whatsappUrl = `https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(appt.patientName)},%20confirming%20your%20appointment%20with%20Dr.%20Megha%20Bobde%20on%20${appt.appointmentDate}%20at%20${appt.timeSlot}.`;

              return (
                <tr key={appt.id} className="hover:bg-[#FAF6F0]/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-espresso-950">
                    <div>{appt.appointmentDate}</div>
                    <div className="text-brand-700 font-bold">{formatTime12(appt.timeSlot)}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-espresso-950 block">{appt.patientName}</span>
                    <span className="text-[11px] text-espresso-500">
                      {appt.age ? `${appt.age} yrs, ` : ''}{appt.gender || ''}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <a href={`tel:${appt.phone}`} className="text-brand-700 hover:underline font-semibold block font-mono">
                      {appt.phone}
                    </a>
                    {appt.email && <span className="text-[11px] text-espresso-400 block">{appt.email}</span>}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-tan-100 text-espresso-800">
                      {appt.consultationType === 'IN_CLINIC' ? 'In-Clinic (Bavdhan)' : 'Online Video'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs text-espresso-700 leading-relaxed text-xs">
                    {appt.reason}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        appt.status === 'CONFIRMED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : appt.status === 'COMPLETED'
                          ? 'bg-blue-100 text-blue-800'
                          : appt.status === 'CANCELLED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {appt.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold text-xs inline-flex items-center gap-1 border border-emerald-200 shadow-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    {appt.status !== 'COMPLETED' && (
                      <button
                        onClick={() => onUpdateStatus(appt.id, 'COMPLETED')}
                        className="px-2.5 py-1.5 rounded-xl bg-tan-100 text-espresso-800 hover:bg-tan-200 font-medium text-xs"
                      >
                        Complete
                      </button>
                    )}

                    {appt.status !== 'CANCELLED' && (
                      <button
                        onClick={() => onUpdateStatus(appt.id, 'CANCELLED')}
                        className="px-2.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-medium text-xs"
                      >
                        Cancel
                      </button>
                    )}

                    <button
                      onClick={() => onDelete(appt.id)}
                      className="p-1.5 rounded-xl text-espresso-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
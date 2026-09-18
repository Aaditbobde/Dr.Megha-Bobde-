'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Trash2, Phone, Calendar, Clock, Plus, X, Ban, Filter } from 'lucide-react';
import { formatTime12 } from '@/lib/hours-helper';

interface AppointmentsTabProps {
  appointments: any[];
  token: string | null;
  onUpdateStatus: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  showNotification: (msg: string) => void;
}

export default function AppointmentsTab({
  appointments: initial,
  token,
  onUpdateStatus,
  onDelete,
  showNotification,
}: AppointmentsTabProps) {
  const [appointments, setAppointments] = useState(initial);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [blockedSlots, setBlockedSlots] = useState<any[]>([]);
  const [showBlockForm, setShowBlockForm] = useState(false);
  const [blockData, setBlockData] = useState({ date: '', timeSlot: '', reason: '' });

  useEffect(() => { setAppointments(initial); }, [initial]);

  useEffect(() => {
    fetch('/api/blocked-slots')
      .then((r) => r.json())
      .then(setBlockedSlots)
      .catch(console.error);
  }, []);

  const filteredAppointments = appointments.filter((a) => {
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    if (dateFilter && a.appointmentDate !== dateFilter) return false;
    return true;
  });

  const handleBlockSlot = async () => {
    if (!token || !blockData.date) return;
    try {
      const res = await fetch('/api/blocked-slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          date: blockData.date,
          timeSlot: blockData.timeSlot || null,
          reason: blockData.reason || null,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setBlockedSlots([...blockedSlots, created]);
        setBlockData({ date: '', timeSlot: '', reason: '' });
        setShowBlockForm(false);
        showNotification(`Time slot blocked for ${blockData.date}`);
      }
    } catch (err) { console.error(err); }
  };

  const handleUnblock = async (id: string) => {
    if (!token) return;
    try {
      await fetch(`/api/blocked-slots/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlockedSlots(blockedSlots.filter((b) => b.id !== id));
      showNotification('Slot unblocked');
    } catch (err) { console.error(err); }
  };

  const handleStatusChange = (id: string, status: string) => {
    onUpdateStatus(id, status);
    setAppointments(appointments.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    setAppointments(appointments.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Filters & Block Slot */}
      <div className="bg-white rounded-3xl p-5 border border-warm-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-brand-600" />
              <span className="text-xs font-semibold text-espresso-700">Filter:</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-warm-200 rounded-xl text-xs"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-warm-200 rounded-xl text-xs"
            />
            {(statusFilter !== 'ALL' || dateFilter) && (
              <button
                onClick={() => { setStatusFilter('ALL'); setDateFilter(''); }}
                className="text-xs text-brand-700 hover:text-brand-900 font-semibold"
              >
                Clear filters
              </button>
            )}
          </div>
          <button
            onClick={() => setShowBlockForm(!showBlockForm)}
            className="px-4 py-2.5 rounded-xl bg-espresso-900 hover:bg-espresso-800 text-cream-100 font-semibold text-xs flex items-center gap-2 shadow-sm"
          >
            <Ban className="w-4 h-4" />
            <span>Block Time Slot</span>
          </button>
        </div>

        {/* Block Form */}
        {showBlockForm && (
          <div className="mt-4 p-4 bg-cream-50 border border-warm-200 rounded-2xl space-y-3">
            <h4 className="font-bold text-espresso-900 text-sm">Block a Date/Time Slot</h4>
            <p className="text-[11px] text-espresso-500">Patients won't be able to book this time. Leave time empty to block entire day.</p>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="font-semibold text-espresso-700 block mb-1">Date *</label>
                <input
                  type="date"
                  value={blockData.date}
                  onChange={(e) => setBlockData({ ...blockData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-warm-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-espresso-700 block mb-1">Time Slot (optional)</label>
                <input
                  type="time"
                  value={blockData.timeSlot}
                  onChange={(e) => setBlockData({ ...blockData, timeSlot: e.target.value })}
                  className="w-full px-3 py-2 border border-warm-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-espresso-700 block mb-1">Reason</label>
                <input
                  type="text"
                  value={blockData.reason}
                  onChange={(e) => setBlockData({ ...blockData, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-warm-200 rounded-xl text-xs"
                  placeholder="e.g. Doctor on leave"
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                  onClick={handleBlockSlot}
                  disabled={!blockData.date}
                  className="px-4 py-2 rounded-xl bg-brand-600 text-white font-semibold text-xs disabled:opacity-50"
                >
                  Block
                </button>
                <button
                  onClick={() => setShowBlockForm(false)}
                  className="px-3 py-2 rounded-xl bg-warm-100 text-espresso-700 text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Blocked Slots Display */}
        {blockedSlots.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-xs font-bold text-espresso-700 flex items-center gap-1.5">
              <Ban className="w-3.5 h-3.5 text-rose-500" />
              Blocked Slots ({blockedSlots.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {blockedSlots.map((bs) => (
                <div
                  key={bs.id}
                  className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800"
                >
                  <span className="font-semibold">{bs.date}</span>
                  {bs.timeSlot && <span className="font-mono">{formatTime12(bs.timeSlot)}</span>}
                  {bs.reason && <span className="text-rose-600">({bs.reason})</span>}
                  <button
                    onClick={() => handleUnblock(bs.id)}
                    className="p-0.5 text-rose-400 hover:text-rose-700"
                    title="Unblock"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-warm-200 shadow-sm space-y-5">
        <div>
          <h3 className="font-serif font-bold text-lg sm:text-xl text-espresso-950">
            Scheduled Patient Consultations
            <span className="text-sm text-espresso-500 font-sans ml-2">
              ({filteredAppointments.length} shown)
            </span>
          </h3>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="py-12 text-center text-espresso-500 text-sm">
            No appointments match your filters.
          </div>
        ) : (
          <>
            {/* Mobile Card Layout */}
            <div className="block md:hidden space-y-3.5">
              {filteredAppointments.map((appt) => {
                const cleanPhone = appt.phone.replace(/[^0-9]/g, '');
                const whatsappUrl = `https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(appt.patientName)},%20confirming%20your%20appointment%20with%20Dr.%20Megha%20Bobde%20on%20${appt.appointmentDate}%20at%20${appt.timeSlot}.`;

                return (
                  <div key={appt.id} className="p-4 rounded-2xl border border-warm-200 bg-cream-50 space-y-3 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-serif font-bold text-base text-espresso-950">{appt.patientName}</h4>
                        <span className="text-xs text-espresso-600 block">
                          {appt.age ? `${appt.age} yrs, ` : ''}{appt.gender || ''}
                        </span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        appt.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800'
                        : appt.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800'
                        : appt.status === 'CANCELLED' ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                      }`}>
                        {appt.status}
                      </span>
                    </div>

                    <div className="text-xs space-y-1 bg-white p-3 rounded-xl border border-warm-200">
                      <div className="flex items-center justify-between font-semibold text-espresso-900">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-brand-600" />
                          {appt.appointmentDate}
                        </span>
                        <span className="text-brand-700 font-bold">{formatTime12(appt.timeSlot)}</span>
                      </div>
                      <div className="text-[11px] text-espresso-600 pt-1 border-t border-warm-100">
                        <span className="font-semibold text-espresso-800">Mode: </span>
                        {appt.consultationType === 'IN_CLINIC' ? 'In-Clinic (Bavdhan)' : 'Online Video'}
                      </div>
                      {appt.reason && (
                        <div className="text-[11px] text-espresso-600">
                          <span className="font-semibold text-espresso-800">Complaints: </span>{appt.reason}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <a href={`tel:${appt.phone}`}
                        className="min-h-[44px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-warm-300 text-espresso-900 font-semibold text-xs shadow-sm">
                        <Phone className="w-3.5 h-3.5 text-brand-600" /><span>Call</span>
                      </a>
                      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                        className="min-h-[44px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-semibold text-xs shadow-sm">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-700" /><span>WhatsApp</span>
                      </a>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-warm-200 text-xs">
                      <div className="flex gap-2">
                        {appt.status !== 'CONFIRMED' && (
                          <button onClick={() => handleStatusChange(appt.id, 'CONFIRMED')}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white font-medium text-xs shadow-sm">Confirm</button>
                        )}
                        {appt.status !== 'COMPLETED' && (
                          <button onClick={() => handleStatusChange(appt.id, 'COMPLETED')}
                            className="px-2.5 py-1.5 rounded-lg bg-warm-200 text-espresso-800 font-medium text-xs">Complete</button>
                        )}
                        {appt.status !== 'CANCELLED' && (
                          <button onClick={() => handleStatusChange(appt.id, 'CANCELLED')}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 font-medium text-xs">Cancel</button>
                        )}
                      </div>
                      <button onClick={() => handleDelete(appt.id)} className="p-2 rounded-lg text-espresso-400 hover:text-rose-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-warm-200 text-espresso-600 font-semibold uppercase tracking-wider text-[11px] bg-cream-50">
                    <th className="py-3.5 px-4">Date & Slot</th>
                    <th className="py-3.5 px-4">Patient</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Mode</th>
                    <th className="py-3.5 px-4">Complaint</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm-100">
                  {filteredAppointments.map((appt) => {
                    const cleanPhone = appt.phone.replace(/[^0-9]/g, '');
                    const whatsappUrl = `https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(appt.patientName)},%20confirming%20your%20appointment%20with%20Dr.%20Megha%20Bobde%20on%20${appt.appointmentDate}%20at%20${appt.timeSlot}.`;
                    return (
                      <tr key={appt.id} className="hover:bg-cream-50/60 transition-colors">
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
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-warm-100 text-espresso-800">
                            {appt.consultationType === 'IN_CLINIC' ? 'In-Clinic' : 'Online'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs text-espresso-700 leading-relaxed text-xs">{appt.reason}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            appt.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800'
                            : appt.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800'
                            : appt.status === 'CANCELLED' ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                          }`}>{appt.status}</span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                            className="px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold text-xs inline-flex items-center gap-1 border border-emerald-200 shadow-sm">
                            <MessageSquare className="w-3.5 h-3.5" /><span>WhatsApp</span>
                          </a>
                          {appt.status !== 'COMPLETED' && (
                            <button onClick={() => handleStatusChange(appt.id, 'COMPLETED')}
                              className="px-2.5 py-1.5 rounded-xl bg-warm-100 text-espresso-800 hover:bg-warm-200 font-medium text-xs">Complete</button>
                          )}
                          {appt.status !== 'CANCELLED' && (
                            <button onClick={() => handleStatusChange(appt.id, 'CANCELLED')}
                              className="px-2.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-medium text-xs">Cancel</button>
                          )}
                          <button onClick={() => handleDelete(appt.id)} className="p-1.5 rounded-xl text-espresso-400 hover:text-rose-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
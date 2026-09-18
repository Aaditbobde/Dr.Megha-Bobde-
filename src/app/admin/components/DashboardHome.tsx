'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Star,
  MessageSquare,
  Clock,
  Phone,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { formatTime12 } from '@/lib/hours-helper';

interface DashboardHomeProps {
  token: string | null;
  onNavigate: (tab: string) => void;
}

export default function DashboardHome({ token, onNavigate }: DashboardHomeProps) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch('/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-cream-200 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="space-y-1">
        <h2 className="font-serif font-bold text-2xl sm:text-3xl text-espresso-900">
          Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, Dr. Megha
        </h2>
        <p className="text-sm text-espresso-500">{today}</p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Today's Appointments */}
        <button
          onClick={() => onNavigate('appointments')}
          className="boutique-card p-6 text-left group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-espresso-400 group-hover:text-brand-600 transition-colors" />
          </div>
          <span className="text-3xl font-serif font-bold text-espresso-900 block">
            {stats.todayAppointmentCount}
          </span>
          <span className="text-xs font-semibold text-espresso-500 uppercase tracking-wider">
            Today's Appointments
          </span>

          {/* Mini list of today's appointments */}
          {stats.todayAppointments?.length > 0 && (
            <div className="mt-4 space-y-2 border-t border-warm-200 pt-3">
              {stats.todayAppointments.slice(0, 3).map((appt: any) => (
                <div key={appt.id} className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-espresso-800 truncate max-w-[120px]">
                    {appt.patientName}
                  </span>
                  <span className="text-brand-700 font-bold font-mono">
                    {formatTime12(appt.timeSlot)}
                  </span>
                </div>
              ))}
              {stats.todayAppointments.length > 3 && (
                <span className="text-[11px] text-espresso-400">
                  +{stats.todayAppointments.length - 3} more...
                </span>
              )}
            </div>
          )}
        </button>

        {/* Pending Reviews */}
        <button
          onClick={() => onNavigate('reviews')}
          className="boutique-card p-6 text-left group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
              stats.pendingReviews > 0
                ? 'bg-amber-100 text-amber-700'
                : 'bg-sage-100 text-sage-700'
            }`}>
              <Star className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-espresso-400 group-hover:text-brand-600 transition-colors" />
          </div>
          <span className="text-3xl font-serif font-bold text-espresso-900 block">
            {stats.pendingReviews}
          </span>
          <span className="text-xs font-semibold text-espresso-500 uppercase tracking-wider">
            Reviews Awaiting Approval
          </span>
          {stats.pendingReviews > 0 && (
            <div className="mt-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Patients waiting for their review to appear</span>
            </div>
          )}
          {stats.pendingReviews === 0 && (
            <div className="mt-3 px-3 py-2 bg-sage-50 border border-sage-200 rounded-xl text-xs text-sage-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>All reviews are up to date</span>
            </div>
          )}
        </button>

        {/* Unread Inquiries */}
        <button
          onClick={() => onNavigate('inquiries')}
          className="boutique-card p-6 text-left group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
              stats.unreadInquiries > 0
                ? 'bg-brand-100 text-brand-700'
                : 'bg-sage-100 text-sage-700'
            }`}>
              <MessageSquare className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-espresso-400 group-hover:text-brand-600 transition-colors" />
          </div>
          <span className="text-3xl font-serif font-bold text-espresso-900 block">
            {stats.unreadInquiries}
          </span>
          <span className="text-xs font-semibold text-espresso-500 uppercase tracking-wider">
            Unread Patient Inquiries
          </span>
          {stats.unreadInquiries > 0 && (
            <div className="mt-3 px-3 py-2 bg-brand-50 border border-brand-200 rounded-xl text-xs text-brand-800 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>New messages from contact form</span>
            </div>
          )}
        </button>
      </div>

      {/* Quick Info */}
      <div className="boutique-card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs">
        <div className="flex items-center gap-2 text-espresso-600">
          <Clock className="w-4 h-4 text-brand-600" />
          <span>
            <strong className="text-espresso-900">Total Bookings:</strong> {stats.totalAppointments} all-time
          </span>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-700 hover:text-brand-900 font-semibold underline underline-offset-2"
        >
          View public website →
        </a>
      </div>
    </div>
  );
}

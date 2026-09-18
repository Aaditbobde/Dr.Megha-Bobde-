'use client';

import React, { useState } from 'react';
import { Mail, Phone, CheckCircle2, Circle, Trash2, MessageSquare } from 'lucide-react';

interface InquiriesTabProps {
  inquiries: any[];
  token: string | null;
  showNotification: (msg: string) => void;
}

export default function InquiriesTab({ inquiries: initial, token, showNotification }: InquiriesTabProps) {
  const [inquiries, setInquiries] = useState(initial);

  const updateInquiry = async (id: string, data: any) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updated = await res.json();
        setInquiries(inquiries.map((i) => (i.id === id ? updated : i)));
        if (data.isRead !== undefined) showNotification(data.isRead ? 'Marked as read' : 'Marked as unread');
        if (data.isResponded !== undefined) showNotification(data.isResponded ? 'Marked as responded' : 'Marked as not responded');
      }
    } catch (err) { console.error(err); }
  };

  const deleteInquiry = async (id: string) => {
    if (!token || !confirm('Delete this inquiry?')) return;
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setInquiries(inquiries.filter((i) => i.id !== id));
        showNotification('Inquiry deleted');
      }
    } catch (err) { console.error(err); }
  };

  const unreadCount = inquiries.filter((i) => !i.isRead).length;

  if (inquiries.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 border border-warm-200 text-center text-espresso-400 text-xs shadow-sm">
        No patient inquiries received through the contact form yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-warm-200 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="font-serif font-bold text-lg text-espresso-900">
            Contact Form Inquiries
          </h3>
          <p className="text-xs text-espresso-500">
            Direct questions submitted by patients from the Contact page.
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-brand-100 text-brand-800 rounded-full font-bold">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {inquiries.map((inq) => (
          <div
            key={inq.id}
            className={`p-5 rounded-2xl border space-y-3 text-xs transition-all ${
              !inq.isRead
                ? 'bg-brand-50/40 border-brand-200 shadow-sm'
                : 'bg-cream-50 border-warm-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="flex items-center gap-2">
                {!inq.isRead && (
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-500 shrink-0" />
                )}
                <span className="font-bold text-espresso-900 text-sm">{inq.name}</span>
                {inq.isResponded && (
                  <span className="px-2 py-0.5 bg-sage-100 text-sage-800 rounded-full text-[10px] font-bold border border-sage-200">
                    Responded
                  </span>
                )}
              </div>
              <span className="text-espresso-400 text-[11px]">
                {new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px] text-brand-700 font-semibold">
              <a href={`tel:${inq.phone}`} className="hover:underline flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {inq.phone}
              </a>
              {inq.email && (
                <span className="flex items-center gap-1 text-espresso-600">
                  <Mail className="w-3 h-3 text-espresso-400" />
                  {inq.email}
                </span>
              )}
              {inq.subject && (
                <span className="text-espresso-700 bg-white px-2 py-0.5 rounded border border-warm-200">
                  {inq.subject}
                </span>
              )}
            </div>

            <p className="text-espresso-700 bg-white p-3 rounded-xl border border-warm-100 leading-relaxed">
              {inq.message}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-warm-200">
              <button
                onClick={() => updateInquiry(inq.id, { isRead: !inq.isRead })}
                className={`min-h-[36px] px-3 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-colors ${
                  inq.isRead
                    ? 'bg-warm-100 text-espresso-600 hover:bg-warm-200'
                    : 'bg-brand-600 text-white hover:bg-brand-700'
                }`}
              >
                {inq.isRead ? <Circle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>{inq.isRead ? 'Mark Unread' : 'Mark Read'}</span>
              </button>

              <button
                onClick={() => updateInquiry(inq.id, { isResponded: !inq.isResponded, isRead: true })}
                className={`min-h-[36px] px-3 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-colors ${
                  inq.isResponded
                    ? 'bg-sage-100 text-sage-800 hover:bg-sage-200 border border-sage-200'
                    : 'bg-sage-600 text-white hover:bg-sage-700'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{inq.isResponded ? 'Undo Responded' : 'Mark Responded'}</span>
              </button>

              <a
                href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(inq.name)},%20thank%20you%20for%20contacting%20Dr.%20Megha%20Bobde's%20Homoeo%20Clinic.`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[36px] px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-xs flex items-center gap-1.5 hover:bg-emerald-100"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              <button
                onClick={() => deleteInquiry(inq.id)}
                className="min-h-[36px] p-2 rounded-xl text-espresso-400 hover:text-rose-600 hover:bg-rose-50 ml-auto"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
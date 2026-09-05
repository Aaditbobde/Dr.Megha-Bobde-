'use client';

import React from 'react';
import { Mail, Phone, Calendar } from 'lucide-react';

interface InquiriesTabProps {
  inquiries: any[];
}

export default function InquiriesTab({ inquiries }: InquiriesTabProps) {
  if (inquiries.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center text-slate-400 text-xs shadow-sm">
        No patient inquiries received through the contact form yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      <div>
        <h3 className="font-serif font-bold text-lg text-slate-900">
          Contact Form Inquiries
        </h3>
        <p className="text-xs text-slate-500">
          Direct questions submitted by patients from the Contact & Map page.
        </p>
      </div>

      <div className="space-y-4">
        {inquiries.map((inq) => (
          <div
            key={inq.id}
            className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2 text-xs"
          >
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-900 text-sm">{inq.name}</span>
              <span className="text-slate-400 text-[11px]">
                {new Date(inq.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px] text-clinic-700 font-semibold">
              <a href={`tel:${inq.phone}`} className="hover:underline flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {inq.phone}
              </a>
              {inq.email && (
                <span className="flex items-center gap-1 text-slate-600">
                  <Mail className="w-3 h-3 text-slate-400" />
                  {inq.email}
                </span>
              )}
              <span className="text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                Subject: {inq.subject}
              </span>
            </div>

            <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-100 leading-relaxed">
              {inq.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
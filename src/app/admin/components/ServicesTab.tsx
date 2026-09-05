'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface ServicesTabProps {
  services: any[];
}

export default function ServicesTab({ services }: ServicesTabProps) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      <div>
        <h3 className="font-serif font-bold text-lg text-slate-900">
          Treatments & Specialties Catalog
        </h3>
        <p className="text-xs text-slate-500">
          Clinical care areas displayed across the website and booking forms.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((s) => (
          <div key={s.id} className="p-5 border border-slate-200 rounded-2xl space-y-2 bg-slate-50/60">
            <div className="flex justify-between items-start">
              <h4 className="font-serif font-bold text-slate-900 text-sm">{s.title}</h4>
              <span className="text-[10px] font-semibold text-clinic-700 bg-clinic-100 px-2 py-0.5 rounded-full">
                {s.category}
              </span>
            </div>
            <p className="text-xs text-slate-600 line-clamp-2">{s.summary}</p>
            <p className="text-[11px] text-slate-500">
              <strong>Symptoms:</strong> {s.symptoms}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
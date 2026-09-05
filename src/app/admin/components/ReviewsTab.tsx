'use client';

import React from 'react';
import { Star, Trash2 } from 'lucide-react';

interface ReviewsTabProps {
  reviews: any[];
  onToggleApproval: (id: string, isApproved: boolean) => void;
  onDelete: (id: string) => void;
}

export default function ReviewsTab({
  reviews,
  onToggleApproval,
  onDelete,
}: ReviewsTabProps) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      <div>
        <h3 className="font-serif font-bold text-lg text-slate-900">
          Patient Reviews & Feedback Moderation
        </h3>
        <p className="text-xs text-slate-500">
          Approve or reject patient reviews before they are displayed on the public site.
        </p>
      </div>

      <div className="space-y-4">
        {reviews.map((r) => (
          <div
            key={r.id}
            className={`p-5 rounded-2xl border flex flex-col sm:flex-row justify-between items-start gap-4 text-xs ${
              r.isApproved ? 'bg-white border-slate-200' : 'bg-amber-50/70 border-amber-200'
            }`}
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">{r.patientName}</span>
                <span className="text-amber-500 font-bold">{r.rating} ★</span>
                <span className="text-slate-400 text-[11px]">({r.dateString})</span>
                {!r.isApproved && (
                  <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    Pending Approval
                  </span>
                )}
              </div>
              <span className="text-[11px] text-clinic-700 font-medium block">
                Condition: {r.condition}
              </span>
              <p className="text-slate-700 italic leading-relaxed">
                "{r.reviewText}"
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onToggleApproval(r.id, !r.isApproved)}
                className={`px-3 py-1.5 rounded-xl font-semibold text-xs transition-all ${
                  r.isApproved
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                }`}
              >
                {r.isApproved ? 'Unapprove' : 'Approve Review'}
              </button>

              <button
                onClick={() => onDelete(r.id)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50"
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
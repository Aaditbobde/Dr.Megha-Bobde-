'use client';

import React from 'react';
import { Save, ExternalLink } from 'lucide-react';

interface HoursTabProps {
  hours: any[];
  setHours: React.Dispatch<React.SetStateAction<any[]>>;
  onSave: () => void;
}

export default function HoursTab({ hours, setHours, onSave }: HoursTabProps) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-warm-200 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-serif font-bold text-lg text-espresso-900">
            Weekly Split-Session Timings & Live Open/Closed Logic
          </h3>
          <p className="text-xs text-espresso-500">
            Configure morning and evening sessions. Live status dynamically accounts for morning hours, afternoon gap, and evening sessions.
          </p>
        </div>

        <button
          onClick={onSave}
          className="px-5 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save All Timings</span>
        </button>
      </div>

      <div className="space-y-4">
        {hours.map((h, idx) => (
          <div
            key={h.dayOfWeek}
            className={`p-5 rounded-2xl border flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 text-xs transition-all ${
              h.isClosed
                ? 'bg-warm-50 border-warm-200 opacity-75'
                : 'bg-white border-warm-200 shadow-xs'
            }`}
          >
            <div className="w-28 font-bold text-espresso-900 text-sm">
              {h.dayName}
            </div>

            {/* Morning Session */}
            <div className="flex flex-wrap items-center gap-2 bg-cream-50 p-2.5 rounded-xl border border-warm-200">
              <span className="font-semibold text-espresso-700">Morning:</span>
              <input
                type="time"
                value={h.morningOpenTime || '10:30'}
                disabled={h.isClosed}
                onChange={(e) => {
                  const updated = [...hours];
                  updated[idx].morningOpenTime = e.target.value;
                  setHours(updated);
                }}
                className="px-2 py-1 border border-warm-200 rounded-lg text-xs"
              />
              <span className="text-espresso-400">to</span>
              <input
                type="time"
                value={h.morningCloseTime || '13:30'}
                disabled={h.isClosed}
                onChange={(e) => {
                  const updated = [...hours];
                  updated[idx].morningCloseTime = e.target.value;
                  setHours(updated);
                }}
                className="px-2 py-1 border border-warm-200 rounded-lg text-xs"
              />
            </div>

            {/* Evening Session */}
            <div className="flex flex-wrap items-center gap-2 bg-cream-50 p-2.5 rounded-xl border border-warm-200">
              <label className="flex items-center gap-1.5 font-semibold text-espresso-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(h.hasEveningSession)}
                  disabled={h.isClosed}
                  onChange={(e) => {
                    const updated = [...hours];
                    updated[idx].hasEveningSession = e.target.checked;
                    setHours(updated);
                  }}
                  className="rounded text-brand-600"
                />
                <span>Evening:</span>
              </label>

              {h.hasEveningSession ? (
                <>
                  <input
                    type="time"
                    value={h.eveningOpenTime || '18:00'}
                    disabled={h.isClosed}
                    onChange={(e) => {
                      const updated = [...hours];
                      updated[idx].eveningOpenTime = e.target.value;
                      setHours(updated);
                    }}
                    className="px-2 py-1 border border-warm-200 rounded-lg text-xs"
                  />
                  <span className="text-espresso-400">to</span>
                  <input
                    type="time"
                    value={h.eveningCloseTime || '20:30'}
                    disabled={h.isClosed}
                    onChange={(e) => {
                      const updated = [...hours];
                      updated[idx].eveningCloseTime = e.target.value;
                      setHours(updated);
                    }}
                    className="px-2 py-1 border border-warm-200 rounded-lg text-xs"
                  />
                </>
              ) : (
                <span className="text-espresso-400 italic text-[11px] px-2">No evening slot</span>
              )}
            </div>

            {/* Slot & Closure */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1 text-espresso-700">
                <span>Slot:</span>
                <input
                  type="number" min="10" max="60"
                  value={h.slotDurationMinutes || 20}
                  disabled={h.isClosed}
                  onChange={(e) => {
                    const updated = [...hours];
                    updated[idx].slotDurationMinutes = Number(e.target.value);
                    setHours(updated);
                  }}
                  className="w-14 px-2 py-1 border border-warm-200 rounded-lg text-xs text-center"
                />
                <span className="text-espresso-400">min</span>
              </label>

              <label className="flex items-center gap-1.5 font-medium text-espresso-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(h.isClosed)}
                  onChange={(e) => {
                    const updated = [...hours];
                    updated[idx].isClosed = e.target.checked;
                    setHours(updated);
                  }}
                  className="w-4 h-4 rounded text-brand-600"
                />
                <span className={h.isClosed ? 'text-rose-600 font-bold' : ''}>
                  {h.isClosed ? 'Closed' : 'Active'}
                </span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
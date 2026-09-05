'use client';

import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { LiveStatusResult } from '@/lib/hours-helper';

interface LiveStatusBadgeProps {
  className?: string;
  showDetails?: boolean;
}

export default function LiveStatusBadge({ className = '', showDetails = false }: LiveStatusBadgeProps) {
  const [status, setStatus] = useState<LiveStatusResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch('/api/hours');
        if (res.ok) {
          const data = await res.json();
          setStatus(data.liveStatus);
        }
      } catch (err) {
        console.error('Failed to load clinic hours status', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStatus();
    // Refresh status every 60 seconds
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !status) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-warm-100 text-espresso-600 animate-pulse ${className}`}>
        <span className="w-2 h-2 rounded-full bg-warm-300"></span>
        <span>Checking clinic hours...</span>
      </div>
    );
  }

  const isClosingSoon = status.badgeType === 'closing-soon';

  return (
    <div className={`inline-flex flex-col ${className}`}>
      <div
        className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-medium transition-all shadow-xs ${
          status.isOpen
            ? isClosingSoon
              ? 'bg-amber-50 text-amber-900 border border-amber-300'
              : 'bg-sage-50 text-sage-900 border border-sage-300'
            : 'bg-brand-50/70 text-brand-900 border border-brand-200/80'
        }`}
        title={`Today's clinic hours: ${status.todayHoursText}`}
      >
        <span className="relative flex h-2 w-2">
          {status.isOpen && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage-400 opacity-75"></span>
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              status.isOpen
                ? isClosingSoon
                  ? 'bg-amber-500'
                  : 'bg-sage-600'
                : 'bg-brand-500'
            }`}
          ></span>
        </span>

        <span className="font-semibold tracking-wide">{status.badgeText}</span>
      </div>

      {showDetails && (
        <span className="text-[11px] text-espresso-600 mt-1 flex items-center gap-1 pl-1">
          <Clock className="w-3 h-3 text-brand-600" />
          Today: {status.todayHoursText}
        </span>
      )}
    </div>
  );
}
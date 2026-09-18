'use client';

import React from 'react';
import { Save, ExternalLink } from 'lucide-react';

interface SettingsTabProps {
  clinicSettings: any;
  setClinicSettings: React.Dispatch<React.SetStateAction<any>>;
  onSave: (e: React.FormEvent) => void;
}

export default function SettingsTab({
  clinicSettings,
  setClinicSettings,
  onSave,
}: SettingsTabProps) {
  const update = (field: string, value: any) =>
    setClinicSettings({ ...clinicSettings, [field]: value });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-warm-200 shadow-sm space-y-6">
      <div>
        <h3 className="font-serif font-bold text-lg text-espresso-900">
          Clinic Configuration & Contact Details
        </h3>
        <p className="text-xs text-espresso-500">
          Control public address, phone, WhatsApp, email, Instagram, Google rating, and Maps embed.
        </p>
      </div>

      <form onSubmit={onSave} className="space-y-5 text-xs">
        {/* Clinic Names */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-espresso-700 block mb-1">Clinic Name (English)</label>
            <input type="text" value={clinicSettings.clinicNameEn || ''}
              onChange={(e) => update('clinicNameEn', e.target.value)}
              className="w-full px-3.5 py-2.5 border border-warm-200 rounded-xl text-xs text-espresso-800" required />
          </div>
          <div>
            <label className="font-semibold text-espresso-700 block mb-1">Clinic Name (Hindi / Marathi)</label>
            <input type="text" value={clinicSettings.clinicNameHi || ''}
              onChange={(e) => update('clinicNameHi', e.target.value)}
              className="w-full px-3.5 py-2.5 border border-warm-200 rounded-xl text-xs text-espresso-800" required />
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="font-semibold text-espresso-700 block mb-1">Phone (Display)</label>
            <input type="text" value={clinicSettings.phone || ''}
              onChange={(e) => update('phone', e.target.value)}
              className="w-full px-3.5 py-2.5 border border-warm-200 rounded-xl text-xs text-espresso-800" required />
          </div>
          <div>
            <label className="font-semibold text-espresso-700 block mb-1">Phone (Raw — for tel: links)</label>
            <input type="text" value={clinicSettings.phoneRaw || ''}
              onChange={(e) => update('phoneRaw', e.target.value)}
              className="w-full px-3.5 py-2.5 border border-warm-200 rounded-xl text-xs text-espresso-800 font-mono" />
          </div>
          <div>
            <label className="font-semibold text-espresso-700 block mb-1">WhatsApp Number</label>
            <input type="text" value={clinicSettings.whatsapp || ''}
              onChange={(e) => update('whatsapp', e.target.value)}
              className="w-full px-3.5 py-2.5 border border-warm-200 rounded-xl text-xs text-espresso-800 font-mono"
              placeholder="+919270113112" />
          </div>
          <div>
            <label className="font-semibold text-espresso-700 block mb-1">Clinic Email</label>
            <input type="email" value={clinicSettings.email || ''}
              onChange={(e) => update('email', e.target.value)}
              className="w-full px-3.5 py-2.5 border border-warm-200 rounded-xl text-xs text-espresso-800" required />
          </div>
        </div>

        {/* Google Rating */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="font-semibold text-espresso-700 block mb-1">Google Rating (Stars)</label>
            <input type="number" step="0.1" value={clinicSettings.rating || 5.0}
              onChange={(e) => update('rating', parseFloat(e.target.value))}
              className="w-full px-3.5 py-2.5 border border-warm-200 rounded-xl text-xs text-espresso-800" required />
          </div>
          <div>
            <label className="font-semibold text-espresso-700 block mb-1">Google Reviews Count</label>
            <input type="number" value={clinicSettings.reviewCount || 62}
              onChange={(e) => update('reviewCount', parseInt(e.target.value, 10))}
              className="w-full px-3.5 py-2.5 border border-warm-200 rounded-xl text-xs text-espresso-800" required />
          </div>
          <div>
            <label className="font-semibold text-espresso-700 block mb-1">Instagram Link</label>
            <input type="url" value={clinicSettings.instagram || ''}
              onChange={(e) => update('instagram', e.target.value)}
              className="w-full px-3.5 py-2.5 border border-warm-200 rounded-xl text-xs text-espresso-800" />
          </div>
          <div>
            <label className="font-semibold text-espresso-700 block mb-1">YFE Page URL</label>
            <input type="url" value={clinicSettings.yfeUrl || ''}
              onChange={(e) => update('yfeUrl', e.target.value)}
              className="w-full px-3.5 py-2.5 border border-warm-200 rounded-xl text-xs text-espresso-800" />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="font-semibold text-espresso-700 block mb-1">Clinic Address</label>
          <input type="text" value={clinicSettings.address || ''}
            onChange={(e) => update('address', e.target.value)}
            className="w-full px-3.5 py-2.5 border border-warm-200 rounded-xl text-xs text-espresso-800" required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-espresso-700 block mb-1">Google Plus Code</label>
            <input type="text" value={clinicSettings.plusCode || ''}
              onChange={(e) => update('plusCode', e.target.value)}
              className="w-full px-3.5 py-2.5 border border-warm-200 rounded-xl text-xs text-espresso-800 font-mono" />
          </div>
          <div>
            <label className="font-semibold text-espresso-700 block mb-1">Google Maps Embed URL</label>
            <input type="url" value={clinicSettings.googleMapsEmbed || ''}
              onChange={(e) => update('googleMapsEmbed', e.target.value)}
              className="w-full px-3.5 py-2.5 border border-warm-200 rounded-xl text-xs text-espresso-800"
              placeholder="https://www.google.com/maps/embed?pb=..." />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit"
            className="px-6 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2">
            <Save className="w-4 h-4" />
            <span>Save Clinic Settings</span>
          </button>
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="text-brand-700 hover:text-brand-900 font-semibold text-xs flex items-center gap-1">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Site</span>
          </a>
        </div>
      </form>
    </div>
  );
}
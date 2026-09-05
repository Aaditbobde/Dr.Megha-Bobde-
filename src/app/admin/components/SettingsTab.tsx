'use client';

import React from 'react';
import { Save } from 'lucide-react';

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
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      <div>
        <h3 className="font-serif font-bold text-lg text-slate-900">
          Clinic Configuration & Doctor Credentials
        </h3>
        <p className="text-xs text-slate-500">
          Control public address, doctor degrees, clinical experience metrics, phone, Instagram, and top banner.
        </p>
      </div>

      <form onSubmit={onSave} className="space-y-5 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Clinic Name (English)</label>
            <input
              type="text"
              value={clinicSettings.clinicNameEn || ''}
              onChange={(e) => setClinicSettings({ ...clinicSettings, clinicNameEn: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Clinic Name (Hindi / Marathi)</label>
            <input
              type="text"
              value={clinicSettings.clinicNameHi || ''}
              onChange={(e) => setClinicSettings({ ...clinicSettings, clinicNameHi: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Doctor Name</label>
            <input
              type="text"
              value={clinicSettings.doctorName || 'Dr. Megha Abhijit Bobde'}
              onChange={(e) => setClinicSettings({ ...clinicSettings, doctorName: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Qualifications</label>
            <input
              type="text"
              value={clinicSettings.qualifications || 'MD (Mumbai), BHMS'}
              onChange={(e) => setClinicSettings({ ...clinicSettings, qualifications: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Clinical Experience</label>
            <input
              type="text"
              value={clinicSettings.experience || 'Over 15 Years of Clinical Experience'}
              onChange={(e) => setClinicSettings({ ...clinicSettings, experience: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Patients Supported</label>
            <input
              type="text"
              value={clinicSettings.patientsTreated || '2,000+ Patients Supported'}
              onChange={(e) => setClinicSettings({ ...clinicSettings, patientsTreated: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Phone Number (Click-to-Call)</label>
            <input
              type="text"
              value={clinicSettings.phone || '+91 92701 13112'}
              onChange={(e) => setClinicSettings({ ...clinicSettings, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Clinic Email</label>
            <input
              type="email"
              value={clinicSettings.email || 'drmeghahomoeoclinic@gmail.com'}
              onChange={(e) => setClinicSettings({ ...clinicSettings, email: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Google Rating (Stars)</label>
            <input
              type="number"
              step="0.1"
              value={clinicSettings.rating || 5.0}
              onChange={(e) => setClinicSettings({ ...clinicSettings, rating: parseFloat(e.target.value) })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Google Reviews Count</label>
            <input
              type="number"
              value={clinicSettings.reviewCount || 62}
              onChange={(e) => setClinicSettings({ ...clinicSettings, reviewCount: parseInt(e.target.value, 10) })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Instagram Link</label>
            <input
              type="url"
              value={clinicSettings.instagram || 'https://www.instagram.com/dr.megha_bobde/'}
              onChange={(e) => setClinicSettings({ ...clinicSettings, instagram: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">YFE Practitioner Page URL</label>
            <input
              type="url"
              value={clinicSettings.yfeUrl || 'https://www.yoganandafloweressences.com/products/dr-megha'}
              onChange={(e) => setClinicSettings({ ...clinicSettings, yfeUrl: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1">Clinic Address</label>
          <input
            type="text"
            value={clinicSettings.address || ''}
            onChange={(e) => setClinicSettings({ ...clinicSettings, address: e.target.value })}
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800"
            required
          />
        </div>

        {/* Announcement Banner */}
        <div className="pt-4 border-t border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-bold text-slate-900 block text-xs">
              Top Announcement Banner
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-xs text-slate-700">
              <input
                type="checkbox"
                checked={Boolean(clinicSettings.noticeActive)}
                onChange={(e) => setClinicSettings({ ...clinicSettings, noticeActive: e.target.checked })}
                className="w-4 h-4 rounded text-clinic-600"
              />
              <span>Display Banner on Public Website</span>
            </label>
          </div>

          <textarea
            rows={2}
            value={clinicSettings.noticeBanner || ''}
            onChange={(e) => setClinicSettings({ ...clinicSettings, noticeBanner: e.target.value })}
            className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs text-slate-800"
          ></textarea>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-clinic-600 hover:bg-clinic-700 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Clinic Settings</span>
        </button>
      </form>
    </div>
  );
}
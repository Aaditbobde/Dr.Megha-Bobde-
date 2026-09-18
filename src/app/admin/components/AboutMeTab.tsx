'use client';

import React, { useState, useRef } from 'react';
import {
  Save,
  Upload,
  User,
  Heart,
  Sparkles,
  ExternalLink,
  X,
} from 'lucide-react';

interface AboutMeTabProps {
  clinicSettings: any;
  setClinicSettings: React.Dispatch<React.SetStateAction<any>>;
  onSave: (e: React.FormEvent) => void;
  token: string | null;
}

export default function AboutMeTab({
  clinicSettings,
  setClinicSettings,
  onSave,
  token,
}: AboutMeTabProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setClinicSettings({ ...clinicSettings, doctorPhotoUrl: data.url });
      }
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-warm-200 shadow-sm space-y-6">
      <div>
        <h3 className="font-serif font-bold text-lg text-espresso-900">
          About Me & Doctor Profile
        </h3>
        <p className="text-xs text-espresso-500">
          Edit the doctor bio, credentials, philosophy, and profile photo shown on the About page.
        </p>
      </div>

      <form onSubmit={onSave} className="space-y-6 text-xs">
        {/* Doctor Photo */}
        <div className="space-y-3">
          <label className="font-semibold text-espresso-700 block">
            Doctor Profile Photo
          </label>
          <div className="flex items-center gap-4">
            {clinicSettings.doctorPhotoUrl ? (
              <div className="relative">
                <img
                  src={clinicSettings.doctorPhotoUrl}
                  alt="Doctor photo"
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-brand-200 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setClinicSettings({ ...clinicSettings, doctorPhotoUrl: '' })}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-cream-200 border-2 border-dashed border-warm-300 flex items-center justify-center">
                <User className="w-8 h-8 text-warm-400" />
              </div>
            )}
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2.5 rounded-xl bg-brand-50 border border-brand-200 text-brand-800 font-semibold text-xs hover:bg-brand-100 transition-colors flex items-center gap-2"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? 'Uploading...' : 'Upload Photo'}</span>
              </button>
              <p className="text-[11px] text-espresso-400 mt-1">
                JPG, PNG, or WEBP. Max 10MB.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Credentials Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-espresso-700 block mb-1">Doctor Name</label>
            <input
              type="text"
              value={clinicSettings.doctorName || ''}
              onChange={(e) => setClinicSettings({ ...clinicSettings, doctorName: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-warm-200 rounded-xl text-xs text-espresso-800"
            />
          </div>
          <div>
            <label className="font-semibold text-espresso-700 block mb-1">Qualifications</label>
            <input
              type="text"
              value={clinicSettings.qualifications || ''}
              onChange={(e) => setClinicSettings({ ...clinicSettings, qualifications: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-warm-200 rounded-xl text-xs text-espresso-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-espresso-700 block mb-1">Clinical Experience</label>
            <input
              type="text"
              value={clinicSettings.experience || ''}
              onChange={(e) => setClinicSettings({ ...clinicSettings, experience: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-warm-200 rounded-xl text-xs text-espresso-800"
              placeholder="e.g. Over 15 Years of Clinical Experience"
            />
          </div>
          <div>
            <label className="font-semibold text-espresso-700 block mb-1">Patients Supported</label>
            <input
              type="text"
              value={clinicSettings.patientsTreated || ''}
              onChange={(e) => setClinicSettings({ ...clinicSettings, patientsTreated: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-warm-200 rounded-xl text-xs text-espresso-800"
              placeholder="e.g. 2,000+ Patients Supported"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="font-semibold text-espresso-700 block mb-1">
            <Heart className="w-3.5 h-3.5 inline mr-1 text-brand-500" />
            Doctor Bio (About Page)
          </label>
          <textarea
            rows={6}
            value={clinicSettings.aboutBio || ''}
            onChange={(e) => setClinicSettings({ ...clinicSettings, aboutBio: e.target.value })}
            className="w-full px-3.5 py-2.5 border border-warm-200 rounded-xl text-xs text-espresso-800 leading-relaxed"
            placeholder="Write the main bio paragraph for the About page..."
          />
        </div>

        {/* Philosophy */}
        <div>
          <label className="font-semibold text-espresso-700 block mb-1">
            "Healing Beyond the Clinic Walls" — Philosophy Section
          </label>
          <textarea
            rows={5}
            value={clinicSettings.philosophy || ''}
            onChange={(e) => setClinicSettings({ ...clinicSettings, philosophy: e.target.value })}
            className="w-full px-3.5 py-2.5 border border-warm-200 rounded-xl text-xs text-espresso-800 leading-relaxed"
            placeholder="Describe the doctor's healing philosophy..."
          />
        </div>

        {/* YFE Description */}
        <div>
          <label className="font-semibold text-espresso-700 block mb-1">
            <Sparkles className="w-3.5 h-3.5 inline mr-1 text-brand-500" />
            Yogananda Flower Essences (YFE) Description
          </label>
          <textarea
            rows={4}
            value={clinicSettings.yfeDescription || ''}
            onChange={(e) => setClinicSettings({ ...clinicSettings, yfeDescription: e.target.value })}
            className="w-full px-3.5 py-2.5 border border-warm-200 rounded-xl text-xs text-espresso-800 leading-relaxed"
            placeholder="Describe the YFE therapy modality..."
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save About Me</span>
          </button>
          <a
            href="/about"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-700 hover:text-brand-900 font-semibold text-xs flex items-center gap-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View About Page</span>
          </a>
        </div>
      </form>
    </div>
  );
}

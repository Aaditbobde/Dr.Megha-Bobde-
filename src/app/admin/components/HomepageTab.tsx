'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Megaphone,
  Layout,
} from 'lucide-react';

interface HomepageTabProps {
  clinicSettings: any;
  setClinicSettings: React.Dispatch<React.SetStateAction<any>>;
  onSave: (e: React.FormEvent) => void;
  token: string | null;
}

const ICON_OPTIONS = [
  'ShieldCheck', 'Sparkles', 'Smile', 'Heart', 'Activity',
  'Flower', 'Brain', 'Leaf', 'Sun', 'Zap',
];

export default function HomepageTab({
  clinicSettings,
  setClinicSettings,
  onSave,
  token,
}: HomepageTabProps) {
  const [modalities, setModalities] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newModality, setNewModality] = useState({ title: '', description: '', icon: 'ShieldCheck' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/modalities')
      .then((r) => r.json())
      .then(setModalities)
      .catch(console.error);
  }, []);

  const handleAddModality = async () => {
    if (!token || !newModality.title) return;
    setSaving(true);
    try {
      const res = await fetch('/api/modalities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...newModality, order: modalities.length }),
      });
      if (res.ok) {
        const created = await res.json();
        setModalities([...modalities, created]);
        setNewModality({ title: '', description: '', icon: 'ShieldCheck' });
        setShowAddForm(false);
      }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDeleteModality = async (id: string) => {
    if (!token || !confirm('Remove this modality card?')) return;
    try {
      await fetch(`/api/modalities/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setModalities(modalities.filter((m) => m.id !== id));
    } catch (err) { console.error(err); }
  };

  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    if (!token) return;
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= modalities.length) return;

    const updated = [...modalities];
    [updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]];

    // Update order values
    const promises = updated.map((m, i) =>
      fetch(`/api/modalities/${m.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...m, order: i }),
      })
    );
    await Promise.all(promises);
    setModalities(updated.map((m, i) => ({ ...m, order: i })));
  };

  const handleUpdateModality = async (id: string, field: string, value: string) => {
    if (!token) return;
    const mod = modalities.find((m) => m.id === id);
    if (!mod) return;
    const updatedData = { ...mod, [field]: value };

    try {
      const res = await fetch(`/api/modalities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(updatedData),
      });
      if (res.ok) {
        setModalities(modalities.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-6">
      {/* Hero Content Editor */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-warm-200 shadow-sm space-y-5">
        <div className="flex items-center gap-2">
          <Layout className="w-5 h-5 text-brand-600" />
          <h3 className="font-serif font-bold text-lg text-espresso-900">
            Hero Section Content
          </h3>
        </div>
        <p className="text-xs text-espresso-500">
          Edit the main headline, subheadline, and tagline displayed in the hero section on the homepage.
        </p>

        <form onSubmit={onSave} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-espresso-700 block mb-1">Tagline (Small Text Above Headline)</label>
            <input
              type="text"
              value={clinicSettings.tagline || ''}
              onChange={(e) => setClinicSettings({ ...clinicSettings, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-warm-200 rounded-xl text-xs text-espresso-800"
              placeholder="e.g. Root-Cause Holistic Healing"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-espresso-700 block mb-1">Hero Headline (Line 1)</label>
              <input
                type="text"
                value={clinicSettings.heroHeadline || ''}
                onChange={(e) => setClinicSettings({ ...clinicSettings, heroHeadline: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-warm-200 rounded-xl text-xs text-espresso-800"
                placeholder="e.g. Dr. Megha Bobde's"
              />
            </div>
            <div>
              <label className="font-semibold text-espresso-700 block mb-1">Hero Headline (Line 2 — Orange)</label>
              <input
                type="text"
                value={clinicSettings.heroSubheadline || ''}
                onChange={(e) => setClinicSettings({ ...clinicSettings, heroSubheadline: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-warm-200 rounded-xl text-xs text-espresso-800"
                placeholder="e.g. Homoeo Clinic"
              />
            </div>
          </div>

          {/* Announcement Banner */}
          <div className="pt-4 border-t border-warm-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-espresso-900 block text-xs flex items-center gap-1.5">
                <Megaphone className="w-3.5 h-3.5 text-brand-600" />
                Top Announcement Banner
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-medium text-xs text-espresso-700">
                <input
                  type="checkbox"
                  checked={Boolean(clinicSettings.noticeActive)}
                  onChange={(e) => setClinicSettings({ ...clinicSettings, noticeActive: e.target.checked })}
                  className="w-4 h-4 rounded text-brand-600"
                />
                <span>Display on Public Site</span>
              </label>
            </div>
            <textarea
              rows={2}
              value={clinicSettings.noticeBanner || ''}
              onChange={(e) => setClinicSettings({ ...clinicSettings, noticeBanner: e.target.value })}
              className="w-full px-3.5 py-2 border border-warm-200 rounded-xl text-xs text-espresso-800"
              placeholder="e.g. Clinic closed for Diwali — Oct 31 to Nov 2"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Hero Content</span>
            </button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-700 hover:text-brand-900 font-semibold text-xs flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Homepage</span>
            </a>
          </div>
        </form>
      </div>

      {/* Modality Cards Editor */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-warm-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="font-serif font-bold text-lg text-espresso-900">
              Treatment Modality Highlight Cards
            </h3>
            <p className="text-xs text-espresso-500">
              These cards appear on the homepage under "Our Integrated Modalities."
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Card</span>
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="p-5 bg-cream-50 border border-warm-200 rounded-2xl space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <input
                type="text"
                placeholder="Card title"
                value={newModality.title}
                onChange={(e) => setNewModality({ ...newModality, title: e.target.value })}
                className="px-3 py-2 border border-warm-200 rounded-xl"
              />
              <select
                value={newModality.icon}
                onChange={(e) => setNewModality({ ...newModality, icon: e.target.value })}
                className="px-3 py-2 border border-warm-200 rounded-xl"
              >
                {ICON_OPTIONS.map((ic) => (
                  <option key={ic} value={ic}>{ic}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleAddModality}
                  disabled={saving || !newModality.title}
                  className="px-4 py-2 rounded-xl bg-brand-600 text-white font-semibold text-xs disabled:opacity-50"
                >
                  {saving ? 'Adding...' : 'Add'}
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-2 rounded-xl bg-warm-100 text-espresso-700 text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
            <textarea
              placeholder="Short description for the card"
              value={newModality.description}
              onChange={(e) => setNewModality({ ...newModality, description: e.target.value })}
              className="w-full px-3 py-2 border border-warm-200 rounded-xl text-xs"
              rows={2}
            />
          </div>
        )}

        {/* Modality Cards List */}
        <div className="space-y-3">
          {modalities.map((mod, index) => (
            <div
              key={mod.id}
              className="p-4 border border-warm-200 rounded-2xl bg-cream-50 flex flex-col sm:flex-row gap-3 items-start sm:items-center"
            >
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleReorder(index, 'up')}
                  disabled={index === 0}
                  className="p-1.5 rounded-lg text-espresso-400 hover:text-brand-600 disabled:opacity-30"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleReorder(index, 'down')}
                  disabled={index === modalities.length - 1}
                  className="p-1.5 rounded-lg text-espresso-400 hover:text-brand-600 disabled:opacity-30"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 h-8 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold font-serif">
                  {index + 1}
                </span>
              </div>

              <div className="flex-1 space-y-1.5 text-xs min-w-0">
                <input
                  type="text"
                  value={mod.title}
                  onChange={(e) => handleUpdateModality(mod.id, 'title', e.target.value)}
                  className="font-bold text-espresso-900 text-sm bg-transparent border-b border-transparent hover:border-warm-300 focus:border-brand-400 outline-none w-full transition-colors"
                />
                <input
                  type="text"
                  value={mod.description}
                  onChange={(e) => handleUpdateModality(mod.id, 'description', e.target.value)}
                  className="text-espresso-600 bg-transparent border-b border-transparent hover:border-warm-300 focus:border-brand-400 outline-none w-full transition-colors"
                />
              </div>

              <button
                onClick={() => handleDeleteModality(mod.id)}
                className="p-2 rounded-xl text-espresso-400 hover:text-rose-600 hover:bg-rose-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {modalities.length === 0 && (
            <p className="text-center text-espresso-400 text-xs py-8">
              No modality cards yet. Click "Add Card" above to create one.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Save,
  X,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Edit3,
  Eye,
} from 'lucide-react';

const ICON_OPTIONS = [
  'Activity', 'ShieldCheck', 'Heart', 'Sparkles', 'Brain',
  'Flower', 'Leaf', 'Sun', 'Smile', 'Baby', 'Zap',
  'Droplets', 'Wind', 'Apple', 'Shield',
];

interface ServicesTabProps {
  services: any[];
  token: string | null;
  onRefresh: () => void;
  showNotification: (msg: string) => void;
}

export default function ServicesTab({
  services: initialServices,
  token,
  onRefresh,
  showNotification,
}: ServicesTabProps) {
  const [services, setServices] = useState(initialServices);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'General',
    summary: '',
    description: '',
    icon: 'Activity',
    symptoms: '',
    approach: '',
    isFeatured: true,
    order: 0,
  });

  const resetForm = () => {
    setFormData({
      title: '', slug: '', category: 'General', summary: '',
      description: '', icon: 'Activity', symptoms: '', approach: '',
      isFeatured: true, order: services.length,
    });
  };

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleCreate = async () => {
    if (!token || !formData.title || !formData.summary) return;
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...formData,
          slug: formData.slug || generateSlug(formData.title),
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setServices([...services, created]);
        resetForm();
        setShowCreateForm(false);
        showNotification(`Service "${created.title}" created!`);
      }
    } catch (err) { console.error(err); }
  };

  const handleUpdate = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const updated = await res.json();
        setServices(services.map((s) => (s.id === id ? updated : s)));
        setEditingId(null);
        showNotification(`Service "${updated.title}" updated!`);
      }
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!token || !confirm(`Delete service "${title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setServices(services.filter((s) => s.id !== id));
        showNotification(`Service "${title}" deleted.`);
      }
    } catch (err) { console.error(err); }
  };

  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    if (!token) return;
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= services.length) return;

    const updated = [...services];
    [updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]];

    const promises = updated.map((s, i) =>
      fetch(`/api/services/${s.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...s, order: i }),
      })
    );
    await Promise.all(promises);
    setServices(updated.map((s, i) => ({ ...s, order: i })));
  };

  const startEditing = (service: any) => {
    setFormData({
      title: service.title,
      slug: service.slug,
      category: service.category,
      summary: service.summary,
      description: service.description,
      icon: service.icon,
      symptoms: service.symptoms,
      approach: service.approach,
      isFeatured: service.isFeatured,
      order: service.order,
    });
    setEditingId(service.id);
  };

  const ServiceForm = ({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) => (
    <div className="space-y-4 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="font-semibold text-espresso-700 block mb-1">Service Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => {
              setFormData({
                ...formData,
                title: e.target.value,
                slug: formData.slug || generateSlug(e.target.value),
              });
            }}
            className="w-full px-3.5 py-2.5 border border-warm-200 rounded-xl text-xs text-espresso-800"
            placeholder="e.g. Chronic Skin Conditions"
          />
        </div>
        <div>
          <label className="font-semibold text-espresso-700 block mb-1">Icon</label>
          <select
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            className="w-full px-3 py-2.5 border border-warm-200 rounded-xl text-xs"
          >
            {ICON_OPTIONS.map((ic) => (
              <option key={ic} value={ic}>{ic}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="font-semibold text-espresso-700 block mb-1">URL Slug</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full px-3.5 py-2.5 border border-warm-200 rounded-xl text-xs text-espresso-800 font-mono"
            placeholder="auto-generated-from-title"
          />
        </div>
        <div>
          <label className="font-semibold text-espresso-700 block mb-1">Category</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3.5 py-2.5 border border-warm-200 rounded-xl text-xs text-espresso-800"
            placeholder="e.g. Chronic Care, Women's Health"
          />
        </div>
      </div>

      <div>
        <label className="font-semibold text-espresso-700 block mb-1">Short Summary *</label>
        <textarea
          rows={2}
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          className="w-full px-3.5 py-2 border border-warm-200 rounded-xl text-xs text-espresso-800"
          placeholder="Brief summary shown on the services listing page..."
        />
      </div>

      <div>
        <label className="font-semibold text-espresso-700 block mb-1">Full Description (Detail Page)</label>
        <textarea
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3.5 py-2 border border-warm-200 rounded-xl text-xs text-espresso-800"
          placeholder="Detailed content for /services/[slug] page..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="font-semibold text-espresso-700 block mb-1">Common Symptoms</label>
          <textarea
            rows={2}
            value={formData.symptoms}
            onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
            className="w-full px-3.5 py-2 border border-warm-200 rounded-xl text-xs text-espresso-800"
            placeholder="Eczema, Psoriasis, Urticaria..."
          />
        </div>
        <div>
          <label className="font-semibold text-espresso-700 block mb-1">Treatment Approach</label>
          <textarea
            rows={2}
            value={formData.approach}
            onChange={(e) => setFormData({ ...formData, approach: e.target.value })}
            className="w-full px-3.5 py-2 border border-warm-200 rounded-xl text-xs text-espresso-800"
            placeholder="Constitutional remedies, dietary guidance..."
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer text-xs text-espresso-700">
          <input
            type="checkbox"
            checked={formData.isFeatured}
            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
            className="w-4 h-4 rounded text-brand-600"
          />
          <span className="font-semibold">Featured on homepage</span>
        </label>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={onSubmit}
          className="px-5 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm flex items-center gap-2"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{submitLabel}</span>
        </button>
        <button
          onClick={() => { setEditingId(null); setShowCreateForm(false); }}
          className="px-4 py-2.5 rounded-full bg-warm-100 text-espresso-700 font-semibold text-xs"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-warm-200 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="font-serif font-bold text-lg text-espresso-900">
            Treatments & Specialties Catalog
          </h3>
          <p className="text-xs text-espresso-500">
            Add, edit, reorder, and delete clinical services. Each service gets its own detail page at /services/[slug].
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowCreateForm(true); setEditingId(null); }}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && !editingId && (
        <div className="p-5 bg-cream-50 border border-warm-200 rounded-2xl">
          <h4 className="font-bold text-espresso-900 text-sm mb-4">Create New Service</h4>
          <ServiceForm onSubmit={handleCreate} submitLabel="Create Service" />
        </div>
      )}

      {/* Services List */}
      <div className="space-y-3">
        {services.map((s, index) => (
          <div key={s.id}>
            {editingId === s.id ? (
              <div className="p-5 bg-brand-50/50 border border-brand-200 rounded-2xl">
                <h4 className="font-bold text-espresso-900 text-sm mb-4">Editing: {s.title}</h4>
                <ServiceForm onSubmit={() => handleUpdate(s.id)} submitLabel="Save Changes" />
              </div>
            ) : (
              <div className="p-4 border border-warm-200 rounded-2xl bg-cream-50 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleReorder(index, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded text-espresso-400 hover:text-brand-600 disabled:opacity-30"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleReorder(index, 'down')}
                    disabled={index === services.length - 1}
                    className="p-1 rounded text-espresso-400 hover:text-brand-600 disabled:opacity-30"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-serif font-bold text-espresso-900 text-sm">{s.title}</h4>
                    <span className="text-[11px] font-semibold text-brand-700 bg-brand-100 px-2 py-0.5 rounded-full">
                      {s.category}
                    </span>
                    {s.isFeatured && (
                      <span className="text-[10px] font-semibold text-sage-700 bg-sage-100 px-2 py-0.5 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-espresso-600 line-clamp-1 mt-0.5">{s.summary}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={`/services/${s.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl text-espresso-400 hover:text-brand-600 hover:bg-brand-50"
                    title="View on site"
                  >
                    <Eye className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => startEditing(s)}
                    className="p-2 rounded-xl text-espresso-400 hover:text-brand-600 hover:bg-brand-50"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(s.id, s.title)}
                    className="p-2 rounded-xl text-espresso-400 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { Star, Trash2, Plus, Save, X } from 'lucide-react';

interface ReviewsTabProps {
  reviews: any[];
  token: string | null;
  onToggleApproval: (id: string, isApproved: boolean) => void;
  onDelete: (id: string) => void;
  showNotification: (msg: string) => void;
}

export default function ReviewsTab({
  reviews: initialReviews,
  token,
  onToggleApproval,
  onDelete,
  showNotification,
}: ReviewsTabProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    condition: '',
    rating: 5,
    reviewText: '',
    dateString: '',
  });

  const handleAddReview = async () => {
    if (!token || !formData.patientName || !formData.reviewText) return;
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const data = await res.json();
        setReviews([data.testimonial, ...reviews]);
        setFormData({ patientName: '', condition: '', rating: 5, reviewText: '', dateString: '' });
        setShowAddForm(false);
        showNotification(`Review added for "${formData.patientName}"`);
      }
    } catch (err) { console.error(err); }
  };

  const handleToggle = (id: string, isApproved: boolean) => {
    onToggleApproval(id, isApproved);
    setReviews(reviews.map((r) => (r.id === id ? { ...r, isApproved } : r)));
  };

  const handleDel = (id: string) => {
    onDelete(id);
    setReviews(reviews.filter((r) => r.id !== id));
  };

  const pendingCount = reviews.filter((r) => !r.isApproved).length;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-warm-200 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="font-serif font-bold text-lg text-espresso-900">
            Patient Reviews & Feedback Moderation
          </h3>
          <p className="text-xs text-espresso-500">
            Approve or reject patient reviews before they appear publicly.
            {pendingCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-bold">
                {pendingCount} pending
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Review Manually</span>
        </button>
      </div>

      {/* Manual Add Form */}
      {showAddForm && (
        <div className="p-5 bg-cream-50 border border-warm-200 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-espresso-900 text-sm">Add Review on Patient's Behalf</h4>
            <button onClick={() => setShowAddForm(false)} className="p-1 text-espresso-400 hover:text-espresso-700">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="font-semibold text-espresso-700 block mb-1">Patient Name *</label>
              <input
                type="text"
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-warm-200 rounded-xl text-xs"
                placeholder="e.g. Rajesh Sharma"
              />
            </div>
            <div>
              <label className="font-semibold text-espresso-700 block mb-1">Condition Treated</label>
              <input
                type="text"
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-warm-200 rounded-xl text-xs"
                placeholder="e.g. Chronic Eczema"
              />
            </div>
            <div>
              <label className="font-semibold text-espresso-700 block mb-1">Rating</label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                className="w-full px-3 py-2.5 border border-warm-200 rounded-xl text-xs"
              >
                {[5, 4.5, 4, 3.5, 3].map((r) => (
                  <option key={r} value={r}>{r} ★</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="font-semibold text-espresso-700 block mb-1 text-xs">Review Text *</label>
            <textarea
              rows={3}
              value={formData.reviewText}
              onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
              className="w-full px-3.5 py-2 border border-warm-200 rounded-xl text-xs"
              placeholder="Enter the patient's review text..."
            />
          </div>
          <button
            onClick={handleAddReview}
            disabled={!formData.patientName || !formData.reviewText}
            className="px-5 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save & Publish Review</span>
          </button>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((r) => (
          <div
            key={r.id}
            className={`p-5 rounded-2xl border flex flex-col sm:flex-row justify-between items-start gap-4 text-xs ${
              r.isApproved ? 'bg-white border-warm-200' : 'bg-amber-50/70 border-amber-200'
            }`}
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-espresso-900 text-sm">{r.patientName}</span>
                <span className="text-amber-500 font-bold">{r.rating} ★</span>
                <span className="text-espresso-400 text-[11px]">({r.dateString})</span>
                {!r.isApproved && (
                  <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    Pending Approval
                  </span>
                )}
              </div>
              <span className="text-[11px] text-brand-700 font-medium block">
                Condition: {r.condition}
              </span>
              <p className="text-espresso-700 italic leading-relaxed">
                "{r.reviewText}"
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleToggle(r.id, !r.isApproved)}
                className={`px-3 py-1.5 rounded-xl font-semibold text-xs transition-all ${
                  r.isApproved
                    ? 'bg-warm-100 text-espresso-700 hover:bg-warm-200'
                    : 'bg-sage-600 text-white hover:bg-sage-700 shadow-sm'
                }`}
              >
                {r.isApproved ? 'Unapprove' : 'Approve Review'}
              </button>

              <button
                onClick={() => handleDel(r.id)}
                className="p-1.5 rounded-xl text-espresso-400 hover:text-rose-600 hover:bg-rose-50"
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
'use client';

import React, { useState, useRef } from 'react';
import {
  Camera,
  Plus,
  Trash2,
  Save,
  AlertCircle,
  CheckCircle2,
  UploadCloud,
  Link as LinkIcon,
  X,
  HelpCircle,
  Edit3,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface GalleryTabProps {
  token: string | null;
  onRefresh: () => void;
}

export default function GalleryTab({ token, onRefresh }: GalleryTabProps) {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ title: '', altText: '', category: '', order: 0 });

  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Reception & Waiting Area');
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [order, setOrder] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    'Clinic Exterior',
    'Reception & Waiting Area',
    'Consultation Room',
    'Doctor at Work',
    'Certificates & Natural Remedies',
  ];

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/gallery');
      if (res.ok) {
        const data = await res.json();
        setImages(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    fetchImages();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError('Selected image exceeds 10MB limit.');
      return;
    }
    setError(null);
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    if (!title) {
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      const formattedTitle = nameWithoutExt.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      setTitle(formattedTitle);
      setAltText(`Dr. Megha Bobde Homoeo Clinic in Bavdhan, Pune - ${formattedTitle}`);
    }
  };

  const handleRemoveSelectedFile = () => {
    setSelectedFile(null);
    if (previewUrl) { URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    setError(null);
    setUploadProgress(null);
    try {
      let finalImageUrl = imageUrl;
      if (uploadMode === 'file') {
        if (!selectedFile) { setError('Please select an image.'); setSubmitting(false); return; }
        setUploadProgress('Uploading image...');
        const formData = new FormData();
        formData.append('file', selectedFile);
        const uploadRes = await fetch('/api/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData });
        if (!uploadRes.ok) { const errData = await uploadRes.json(); setError(errData.error || 'Upload failed'); setSubmitting(false); return; }
        const uploadData = await uploadRes.json();
        finalImageUrl = uploadData.url;
      }
      if (!finalImageUrl) { setError('Please provide an image file or URL.'); setSubmitting(false); return; }
      setUploadProgress('Publishing photo...');
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, category, imageUrl: finalImageUrl, altText: altText || title, order: Number(order) || 0 }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || 'Failed to add image'); return; }
      setTitle(''); setImageUrl(''); setAltText('');
      handleRemoveSelectedFile();
      setShowAddModal(false);
      setSuccessNotice(`Photo "${title}" published!`);
      setTimeout(() => setSuccessNotice(null), 5000);
      fetchImages(); onRefresh();
    } catch (err) { setError('Network error during upload'); }
    finally { setSubmitting(false); setUploadProgress(null); }
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Remove this photo?')) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { setImages((prev) => prev.filter((img) => img.id !== id)); onRefresh(); }
    } catch (err) { alert('Failed to delete'); }
  };

  const startEditing = (img: any) => {
    setEditingId(img.id);
    setEditData({ title: img.title, altText: img.altText, category: img.category, order: img.order });
  };

  const handleSaveEdit = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editData),
      });
      if (res.ok) {
        const updated = await res.json();
        setImages(images.map((img) => (img.id === id ? updated : img)));
        setEditingId(null);
        setSuccessNotice('Photo details updated!');
        setTimeout(() => setSuccessNotice(null), 3000);
      }
    } catch (err) { console.error(err); }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    if (!token) return;
    const index = images.findIndex((img) => img.id === id);
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= images.length) return;

    const updated = [...images];
    [updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]];
    setImages(updated);

    const promises = updated.map((img, i) =>
      fetch(`/api/gallery/${img.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ order: i }),
      })
    );
    await Promise.all(promises);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-warm-200 shadow-sm space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-warm-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-brand-600" />
            <h3 className="font-serif font-bold text-xl text-espresso-900">
              Clinic Photo Gallery CMS
            </h3>
          </div>
          <p className="text-xs text-espresso-500 mt-1">
            Upload photos from your device, edit titles/categories, and reorder the gallery.
          </p>
        </div>
        <button
          onClick={() => { setShowAddModal(true); setError(null); }}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /><span>Upload Clinic Photo</span>
        </button>
      </div>

      {successNotice && (
        <div className="p-4 bg-sage-50 border border-sage-200 text-sage-800 text-xs rounded-2xl flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-sage-600 shrink-0" />
          <span className="font-medium">{successNotice}</span>
        </div>
      )}

      {/* How-to guide */}
      <div className="p-4 bg-brand-50/60 border border-brand-100 rounded-2xl flex items-start gap-3 text-xs text-brand-900">
        <HelpCircle className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="block font-semibold">How to upload clinic photos directly:</strong>
          <p className="text-[11px] text-brand-700 leading-relaxed">
            1. Click <strong>"Upload Clinic Photo"</strong> above.<br />
            2. Choose <strong>"Upload from Device"</strong> to pick a photo (.jpg, .png, .webp).<br />
            3. Select a category. Click <strong>"Save & Publish"</strong> — it goes live instantly!
          </p>
        </div>
      </div>

      {/* Upload Modal */}
      {showAddModal && (
        <div className="p-6 bg-cream-50 border border-warm-200 rounded-2xl space-y-5">
          <div className="flex justify-between items-center border-b border-warm-200 pb-3">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-brand-600" />
              <h4 className="font-bold text-espresso-900 text-sm">Upload New Photo</h4>
            </div>
            <button onClick={() => { setShowAddModal(false); handleRemoveSelectedFile(); }}
              className="text-espresso-400 hover:text-espresso-600 text-xs font-bold p-1">
              ✕ Cancel
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" /><span>{error}</span>
            </div>
          )}

          {/* Mode Switcher */}
          <div className="flex gap-2 p-1 bg-warm-200/70 rounded-xl w-fit text-xs font-medium">
            <button type="button" onClick={() => setUploadMode('file')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${uploadMode === 'file' ? 'bg-white text-espresso-900 font-bold shadow-sm' : 'text-espresso-600 hover:text-espresso-900'}`}>
              <UploadCloud className="w-3.5 h-3.5 text-brand-600" /><span>Upload from Device</span>
            </button>
            <button type="button" onClick={() => setUploadMode('url')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${uploadMode === 'url' ? 'bg-white text-espresso-900 font-bold shadow-sm' : 'text-espresso-600 hover:text-espresso-900'}`}>
              <LinkIcon className="w-3.5 h-3.5 text-brand-600" /><span>Web Image URL</span>
            </button>
          </div>

          <form onSubmit={handleAddImage} className="space-y-4 text-xs">
            {uploadMode === 'file' && (
              <div>
                <label className="font-semibold text-espresso-700 block mb-1.5">Select Photo *</label>
                {previewUrl ? (
                  <div className="relative border border-brand-300 bg-brand-50/40 rounded-2xl p-4 flex items-center gap-4">
                    <img src={previewUrl} alt="Preview" className="w-24 h-20 object-cover rounded-xl border border-warm-200 shadow-sm" />
                    <div className="flex-1 min-w-0 text-xs">
                      <p className="font-bold text-espresso-800 truncate">{selectedFile?.name}</p>
                      <p className="text-[11px] text-espresso-500">Size: {selectedFile ? (selectedFile.size / 1024).toFixed(1) + ' KB' : ''}</p>
                      <span className="inline-block mt-1 text-[10px] bg-sage-100 text-sage-700 px-2 py-0.5 rounded-full font-semibold">Ready to upload</span>
                    </div>
                    <button type="button" onClick={handleRemoveSelectedFile} className="p-1.5 text-espresso-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><X className="w-4 h-4" /></button>
                  </div>
                ) : (
                  <div onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-warm-300 hover:border-brand-500 bg-white hover:bg-brand-50/20 rounded-2xl p-6 text-center cursor-pointer transition-all space-y-2">
                    <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto"><UploadCloud className="w-6 h-6" /></div>
                    <div>
                      <span className="font-semibold text-brand-700 hover:underline">Click to browse photo</span>
                      <p className="text-[11px] text-espresso-400 mt-0.5">JPG, PNG, WEBP up to 10MB</p>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" onChange={handleFileSelect} className="hidden" />
                  </div>
                )}
              </div>
            )}

            {uploadMode === 'url' && (
              <div>
                <label className="font-semibold text-espresso-700 block mb-1">Image Web URL *</label>
                <input type="url" placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-warm-200 rounded-xl bg-white" required={uploadMode === 'url'} />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-espresso-700 block mb-1">Photo Title *</label>
                <input type="text" placeholder="e.g. Reception Area" value={title} onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-warm-200 rounded-xl bg-white" required />
              </div>
              <div>
                <label className="font-semibold text-espresso-700 block mb-1">Category *</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-warm-200 rounded-xl bg-white">
                  {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-espresso-700 block mb-1">Alt Text (SEO) *</label>
              <textarea rows={2} placeholder="Descriptive text for search engines..." value={altText} onChange={(e) => setAltText(e.target.value)}
                className="w-full px-3 py-2 border border-warm-200 rounded-xl bg-white" required />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-espresso-500 font-medium">{uploadProgress || ''}</span>
              <button type="submit" disabled={submitting}
                className="px-6 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md flex items-center gap-2 disabled:opacity-70">
                <Save className="w-4 h-4" /><span>{submitting ? 'Uploading...' : 'Save & Publish'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Images Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img, index) => (
          <div key={img.id} className="border border-warm-200 rounded-2xl overflow-hidden bg-cream-50 flex flex-col justify-between hover:shadow-sm transition-all">
            <div>
              <div className="aspect-[4/3] w-full overflow-hidden bg-warm-200">
                <img src={img.imageUrl} alt={img.altText} className="w-full h-full object-cover" />
              </div>

              {editingId === img.id ? (
                <div className="p-4 space-y-2 text-xs">
                  <input type="text" value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-warm-200 rounded-lg text-xs font-bold" />
                  <select value={editData.category} onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-warm-200 rounded-lg text-xs">
                    {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
                  </select>
                  <textarea rows={2} value={editData.altText} onChange={(e) => setEditData({ ...editData, altText: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-warm-200 rounded-lg text-xs" placeholder="Alt text" />
                  <div className="flex gap-2">
                    <button onClick={() => handleSaveEdit(img.id)}
                      className="px-3 py-1.5 rounded-lg bg-brand-600 text-white font-semibold text-xs flex items-center gap-1">
                      <Save className="w-3 h-3" /> Save
                    </button>
                    <button onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 rounded-lg bg-warm-100 text-espresso-700 text-xs">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="p-4 space-y-1.5 text-xs">
                  <span className="text-[10px] font-bold text-brand-700 uppercase bg-brand-100 px-2 py-0.5 rounded-full inline-block">
                    {img.category}
                  </span>
                  <h4 className="font-serif font-bold text-espresso-900 text-sm">{img.title}</h4>
                  <p className="text-espresso-500 text-[11px] line-clamp-2">{img.altText}</p>
                </div>
              )}
            </div>

            <div className="p-4 pt-0 border-t border-warm-200 flex justify-between items-center text-[10px] text-espresso-400">
              <div className="flex items-center gap-1">
                <button onClick={() => handleReorder(img.id, 'up')} disabled={index === 0}
                  className="p-1 rounded text-espresso-400 hover:text-brand-600 disabled:opacity-30"><ArrowUp className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleReorder(img.id, 'down')} disabled={index === images.length - 1}
                  className="p-1 rounded text-espresso-400 hover:text-brand-600 disabled:opacity-30"><ArrowDown className="w-3.5 h-3.5" /></button>
                <span>#{index + 1}</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => startEditing(img)}
                  className="p-1.5 rounded-lg text-espresso-400 hover:text-brand-600 hover:bg-brand-50">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(img.id)}
                  className="p-1.5 rounded-lg text-espresso-400 hover:text-rose-600 hover:bg-rose-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
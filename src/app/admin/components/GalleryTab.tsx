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
  Image as ImageIcon,
  X,
  HelpCircle
} from 'lucide-react';

interface GalleryTabProps {
  token: string | null;
  onRefresh: () => void;
}

export default function GalleryTab({ token, onRefresh }: GalleryTabProps) {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Upload Method: 'file' | 'url'
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Form fields
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

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Selected image exceeds 10MB limit. Please choose a smaller photo.');
      return;
    }

    setError(null);
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Automatically suggest Title & Alt text if not filled yet
    if (!title) {
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      const formattedTitle = nameWithoutExt
        .replace(/[-_]+/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
      setTitle(formattedTitle);
      setAltText(`Dr. Megha Bobde Homoeo Clinic in Bavdhan, Pune - ${formattedTitle}`);
    }
  };

  const handleRemoveSelectedFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    setError(null);
    setUploadProgress(null);

    try {
      let finalImageUrl = imageUrl;

      // 1. If uploadMode === 'file', upload file first
      if (uploadMode === 'file') {
        if (!selectedFile) {
          setError('Please select an image file from your device.');
          setSubmitting(false);
          return;
        }

        setUploadProgress('Uploading image to clinic server...');
        const formData = new FormData();
        formData.append('file', selectedFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!uploadRes.ok) {
          const errData = await uploadRes.json();
          setError(errData.error || 'Failed to upload image file.');
          setSubmitting(false);
          return;
        }

        const uploadData = await uploadRes.json();
        finalImageUrl = uploadData.url;
      }

      if (!finalImageUrl) {
        setError('Please provide an image file or URL.');
        setSubmitting(false);
        return;
      }

      // 2. Save Gallery record in Database
      setUploadProgress('Publishing photo to gallery...');
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          category,
          imageUrl: finalImageUrl,
          altText: altText || title,
          order: Number(order) || 0,
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        setError(d.error || 'Failed to add image to gallery');
        return;
      }

      // Reset form
      setTitle('');
      setImageUrl('');
      setAltText('');
      handleRemoveSelectedFile();
      setShowAddModal(false);
      setSuccessNotice(`Photo "${title}" published to clinic gallery successfully!`);
      setTimeout(() => setSuccessNotice(null), 5000);

      fetchImages();
      onRefresh();
    } catch (err) {
      setError('Network error during upload');
    } finally {
      setSubmitting(false);
      setUploadProgress(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Remove this photo from the gallery?')) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setImages((prev) => prev.filter((img) => img.id !== id));
        onRefresh();
      }
    } catch (err) {
      alert('Failed to delete image');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      
      {/* Header & Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-clinic-600" />
            <h3 className="font-serif font-bold text-xl text-slate-900">
              Clinic Photo Gallery CMS
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Directly upload photos of Dr. Megha Bobde's clinic from your phone or computer, or enter web links.
          </p>
        </div>

        <button
          onClick={() => {
            setShowAddModal(true);
            setError(null);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-clinic-600 hover:bg-clinic-700 text-white font-semibold text-xs shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Clinic Photo</span>
        </button>
      </div>

      {/* Success Notification */}
      {successNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{successNotice}</span>
        </div>
      )}

      {/* Direct CMS Upload Guide Card */}
      <div className="p-4 bg-clinic-50/60 border border-clinic-100 rounded-2xl flex items-start gap-3 text-xs text-clinic-900">
        <HelpCircle className="w-5 h-5 text-clinic-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="block font-semibold">How to upload clinic photos directly:</strong>
          <p className="text-[11px] text-clinic-700 leading-relaxed">
            1. Click <strong>"Upload Clinic Photo"</strong> above.<br />
            2. Choose <strong>"Upload from Device"</strong> to pick any photo (.jpg, .png, .webp) from your phone or computer.<br />
            3. Select a category (e.g. <em>Reception & Waiting Area</em>, <em>Consultation Room</em>, <em>Clinic Exterior</em>).<br />
            4. Click <strong>"Save & Publish Photo"</strong> — it will be automatically stored and immediately displayed on the public <a href="/gallery" target="_blank" className="underline font-semibold">/gallery</a> page!
          </p>
        </div>
      </div>

      {/* Add / Upload Modal */}
      {showAddModal && (
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-5 animate-in fade-in">
          <div className="flex justify-between items-center border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-clinic-600" />
              <h4 className="font-bold text-slate-900 text-sm">Upload New Photo to Gallery</h4>
            </div>
            <button
              onClick={() => {
                setShowAddModal(false);
                handleRemoveSelectedFile();
              }}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1"
            >
              ✕ Cancel
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Mode Switcher */}
          <div className="flex gap-2 p-1 bg-slate-200/70 rounded-xl w-fit text-xs font-medium">
            <button
              type="button"
              onClick={() => setUploadMode('file')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                uploadMode === 'file'
                  ? 'bg-white text-slate-900 font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5 text-clinic-600" />
              <span>Upload from Device (Direct)</span>
            </button>
            <button
              type="button"
              onClick={() => setUploadMode('url')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                uploadMode === 'url'
                  ? 'bg-white text-slate-900 font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5 text-clinic-600" />
              <span>Web Image URL</span>
            </button>
          </div>

          <form onSubmit={handleAddImage} className="space-y-4 text-xs">
            
            {/* File Upload Dropzone / Picker */}
            {uploadMode === 'file' && (
              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">
                  Select Photo from Your Computer or Phone *
                </label>
                
                {previewUrl ? (
                  <div className="relative border border-clinic-300 bg-clinic-50/40 rounded-2xl p-4 flex items-center gap-4">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-24 h-20 object-cover rounded-xl border border-slate-200 shadow-sm"
                    />
                    <div className="flex-1 min-w-0 text-xs">
                      <p className="font-bold text-slate-800 truncate">{selectedFile?.name}</p>
                      <p className="text-[11px] text-slate-500">
                        Size: {selectedFile ? (selectedFile.size / 1024).toFixed(1) + ' KB' : ''}
                      </p>
                      <span className="inline-block mt-1 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                        Ready to upload
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveSelectedFile}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Choose different photo"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-clinic-500 bg-white hover:bg-clinic-50/20 rounded-2xl p-6 text-center cursor-pointer transition-all space-y-2"
                  >
                    <div className="w-12 h-12 rounded-full bg-clinic-50 text-clinic-600 flex items-center justify-center mx-auto">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="font-semibold text-clinic-700 hover:underline">
                        Click to browse photo from computer / mobile
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Supports JPG, PNG, WEBP up to 10MB
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            )}

            {/* URL Input */}
            {uploadMode === 'url' && (
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Image Web URL (Cloudinary / CDN / Unsplash / Google Drive) *
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  required={uploadMode === 'url'}
                />
              </div>
            )}

            {/* Title and Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Photo Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Reception & Patient Waiting Lounge"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Descriptive Alt Text */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Descriptive Alt Text (SEO & Accessibility) *
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Dr. Megha Bobde's Homoeo Clinic reception and waiting lounge in Bavdhan, Pune..."
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                required
              ></textarea>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500 font-medium">
                {uploadProgress || ''}
              </span>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-clinic-600 hover:bg-clinic-700 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70"
              >
                <Save className="w-4 h-4" />
                <span>{submitting ? 'Uploading & Saving...' : 'Save & Publish Photo'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Images List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img) => (
          <div
            key={img.id}
            className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50 flex flex-col justify-between hover:shadow-sm transition-all"
          >
            <div>
              <div className="aspect-[4/3] w-full overflow-hidden bg-slate-200">
                <img
                  src={img.imageUrl}
                  alt={img.altText}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 space-y-1.5 text-xs">
                <span className="text-[10px] font-bold text-clinic-700 uppercase bg-clinic-100 px-2 py-0.5 rounded-full inline-block">
                  {img.category}
                </span>
                <h4 className="font-serif font-bold text-slate-900 text-sm">{img.title}</h4>
                <p className="text-slate-500 text-[11px] line-clamp-2">{img.altText}</p>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
              <span>Order: {img.order}</span>
              <button
                onClick={() => handleDelete(img.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Remove photo"
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
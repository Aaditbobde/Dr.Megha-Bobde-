'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Clock, 
  Settings, 
  FileText, 
  MessageSquare, 
  Star, 
  LogOut, 
  CheckCircle2, 
  ShieldCheck, 
  Camera,
  ExternalLink 
} from 'lucide-react';

import AppointmentsTab from './components/AppointmentsTab';
import HoursTab from './components/HoursTab';
import SettingsTab from './components/SettingsTab';
import ReviewsTab from './components/ReviewsTab';
import ServicesTab from './components/ServicesTab';
import BlogTab from './components/BlogTab';
import InquiriesTab from './components/InquiriesTab';
import GalleryTab from './components/GalleryTab';
import Logo from '@/components/Logo';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'appointments' | 'hours' | 'gallery' | 'settings' | 'services' | 'reviews' | 'blog' | 'inquiries'>('appointments');
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [appointments, setAppointments] = useState<any[]>([]);
  const [hours, setHours] = useState<any[]>([]);
  const [clinicSettings, setClinicSettings] = useState<any>({});
  const [services, setServices] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('megha_clinic_admin_token');
    if (!savedToken) {
      router.push('/admin/login');
      return;
    }
    setToken(savedToken);
    loadAllData(savedToken);
  }, []);

  const loadAllData = async (authToken: string) => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${authToken}` };

      const [
        apptsRes,
        hoursRes,
        settingsRes,
        servicesRes,
        reviewsRes,
        blogRes,
        inquiriesRes,
        galleryRes,
      ] = await Promise.all([
        fetch('/api/appointments', { headers }),
        fetch('/api/hours', { headers }),
        fetch('/api/settings', { headers }),
        fetch('/api/services', { headers }),
        fetch('/api/testimonials?all=true', { headers }),
        fetch('/api/blog?all=true', { headers }),
        fetch('/api/contact', { headers }),
        fetch('/api/gallery', { headers }),
      ]);

      if (apptsRes.ok) setAppointments(await apptsRes.json());
      if (hoursRes.ok) {
        const hData = await hoursRes.json();
        setHours(hData.hours || []);
      }
      if (settingsRes.ok) setClinicSettings(await settingsRes.json());
      if (servicesRes.ok) setServices(await servicesRes.json());
      if (reviewsRes.ok) setReviews(await reviewsRes.json());
      if (blogRes.ok) setBlogPosts(await blogRes.json());
      if (inquiriesRes.ok) setInquiries(await inquiriesRes.json());
      if (galleryRes.ok) setGalleryImages(await galleryRes.json());
    } catch (err) {
      console.error('Error loading admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('megha_clinic_admin_token');
    localStorage.removeItem('megha_clinic_admin_user');
    router.push('/admin/login');
  };

  const showNotification = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const updateAppointmentStatus = async (id: string, newStatus: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
        );
        showNotification(`Appointment marked as ${newStatus}`);
      }
    } catch {
      alert('Failed to update status');
    }
  };

  const deleteAppointment = async (id: string) => {
    if (!token || !confirm('Delete this appointment record?')) return;
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setAppointments((prev) => prev.filter((a) => a.id !== id));
        showNotification('Appointment deleted');
      }
    } catch {
      alert('Failed to delete appointment');
    }
  };

  const saveHours = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/hours', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ hours }),
      });
      if (res.ok) {
        showNotification('Clinic hours and live open/closed status updated!');
      }
    } catch {
      alert('Failed to save hours');
    }
  };

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(clinicSettings),
      });
      if (res.ok) {
        showNotification('Clinic details and credentials saved!');
      }
    } catch {
      alert('Failed to save settings');
    }
  };

  const toggleReviewApproval = async (id: string, isApproved: boolean) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isApproved }),
      });
      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, isApproved } : r))
        );
        showNotification(`Review ${isApproved ? 'Approved' : 'Unapproved'}`);
      }
    } catch {
      alert('Failed to update review');
    }
  };

  const deleteReview = async (id: string) => {
    if (!token || !confirm('Delete this review?')) return;
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        showNotification('Review deleted');
      }
    } catch {
      alert('Failed to delete review');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-espresso-950 flex items-center justify-center text-cream-100 text-sm animate-pulse font-serif">
        Loading Dr. Megha Abhijit Bobde's Clinic CMS...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col text-espresso-950">
      {/* Header */}
      <header className="bg-espresso-950 text-white px-6 py-4 border-b border-espresso-800 flex justify-between items-center sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <Logo variant="white" showSubtitle={false} />
          <div className="hidden sm:block border-l border-espresso-800 pl-3">
            <span className="text-[11px] font-semibold text-brand-300 block uppercase tracking-wider">
              Doctor CMS & Operations Portal
            </span>
            <span className="text-[10px] text-espresso-400">
              Dr. Megha Abhijit Bobde · MD (Mumbai), BHMS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="pill-btn text-xs text-cream-100 hover:text-white flex items-center gap-1.5 bg-espresso-900 hover:bg-espresso-800 px-3.5 py-1.5 rounded-full border border-espresso-700 transition-colors"
          >
            <span>Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleLogout}
            className="pill-btn text-xs text-rose-300 hover:text-rose-100 flex items-center gap-1.5 bg-rose-950/40 hover:bg-rose-950/60 px-3.5 py-1.5 rounded-full border border-rose-900/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {statusMessage && (
        <div className="fixed top-16 right-6 z-50 bg-sage-800 text-white text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-sage-300" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 mb-8">
          <div className="boutique-card p-4 bg-white">
            <span className="text-[10px] font-bold text-espresso-500 uppercase block tracking-wider">Appointments</span>
            <span className="text-2xl font-serif font-bold text-espresso-950 mt-1 block">{appointments.length}</span>
          </div>

          <div className="boutique-card p-4 bg-white">
            <span className="text-[10px] font-bold text-espresso-500 uppercase block tracking-wider">Google Rating</span>
            <span className="text-2xl font-serif font-bold text-amber-500 mt-1 block">5.0 ★</span>
            <span className="text-[10px] text-espresso-400">62 Reviews</span>
          </div>

          <div className="boutique-card p-4 bg-white">
            <span className="text-[10px] font-bold text-espresso-500 uppercase block tracking-wider">Modalities</span>
            <span className="text-2xl font-serif font-bold text-brand-700 mt-1 block">{services.length}</span>
          </div>

          <div className="boutique-card p-4 bg-white">
            <span className="text-[10px] font-bold text-espresso-500 uppercase block tracking-wider">Gallery Photos</span>
            <span className="text-2xl font-serif font-bold text-espresso-950 mt-1 block">{galleryImages.length}</span>
          </div>

          <div className="boutique-card p-4 bg-white">
            <span className="text-[10px] font-bold text-espresso-500 uppercase block tracking-wider">Reviews</span>
            <span className="text-2xl font-serif font-bold text-espresso-950 mt-1 block">{reviews.length}</span>
          </div>

          <div className="boutique-card p-4 bg-white">
            <span className="text-[10px] font-bold text-espresso-500 uppercase block tracking-wider">Blog Posts</span>
            <span className="text-2xl font-serif font-bold text-espresso-950 mt-1 block">{blogPosts.length}</span>
          </div>

          <div className="boutique-card p-4 bg-white">
            <span className="text-[10px] font-bold text-espresso-500 uppercase block tracking-wider">Inquiries</span>
            <span className="text-2xl font-serif font-bold text-espresso-950 mt-1 block">{inquiries.length}</span>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex overflow-x-auto gap-2 border-b border-tan-200 pb-3 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          {[
            { id: 'appointments', label: 'Appointments', icon: Calendar },
            { id: 'hours', label: 'Split Hours & Live Status', icon: Clock },
            { id: 'gallery', label: 'Clinic Gallery CMS', icon: Camera },
            { id: 'settings', label: 'Clinic Details & Credentials', icon: Settings },
            { id: 'services', label: 'Treatments & Modalities', icon: ShieldCheck },
            { id: 'reviews', label: 'Patient Reviews (62)', icon: Star },
            { id: 'blog', label: 'Health Blog', icon: FileText },
            { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`shrink-0 min-h-[44px] flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'pill-btn bg-brand-600 text-white shadow-md shadow-brand-500/20'
                    : 'bg-white text-espresso-700 hover:bg-tan-50 border border-tan-200 active:bg-tan-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Tab Panels */}
        {activeTab === 'appointments' && (
          <AppointmentsTab
            appointments={appointments}
            onUpdateStatus={updateAppointmentStatus}
            onDelete={deleteAppointment}
          />
        )}

        {activeTab === 'hours' && (
          <HoursTab
            hours={hours}
            setHours={setHours}
            onSave={saveHours}
          />
        )}

        {activeTab === 'gallery' && (
          <GalleryTab
            token={token}
            onRefresh={() => loadAllData(token!)}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsTab
            clinicSettings={clinicSettings}
            setClinicSettings={setClinicSettings}
            onSave={saveSettings}
          />
        )}

        {activeTab === 'services' && (
          <ServicesTab services={services} />
        )}

        {activeTab === 'reviews' && (
          <ReviewsTab
            reviews={reviews}
            onToggleApproval={toggleReviewApproval}
            onDelete={deleteReview}
          />
        )}

        {activeTab === 'blog' && (
          <BlogTab blogPosts={blogPosts} />
        )}

        {activeTab === 'inquiries' && (
          <InquiriesTab inquiries={inquiries} />
        )}

      </div>
    </div>
  );
}
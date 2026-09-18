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
  ExternalLink,
  LayoutDashboard,
  User,
  Layout,
  Menu,
  X,
} from 'lucide-react';

import DashboardHome from './components/DashboardHome';
import AppointmentsTab from './components/AppointmentsTab';
import HoursTab from './components/HoursTab';
import SettingsTab from './components/SettingsTab';
import ReviewsTab from './components/ReviewsTab';
import ServicesTab from './components/ServicesTab';
import BlogTab from './components/BlogTab';
import InquiriesTab from './components/InquiriesTab';
import GalleryTab from './components/GalleryTab';
import AboutMeTab from './components/AboutMeTab';
import HomepageTab from './components/HomepageTab';
import Logo from '@/components/Logo';

type TabId = 'dashboard' | 'appointments' | 'hours' | 'gallery' | 'settings' | 'services' | 'reviews' | 'blog' | 'inquiries' | 'about' | 'homepage';

const TABS: { id: TabId; label: string; icon: any; group: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'Overview' },
  { id: 'appointments', label: 'Appointments', icon: Calendar, group: 'Operations' },
  { id: 'hours', label: 'Clinic Hours', icon: Clock, group: 'Operations' },
  { id: 'inquiries', label: 'Inquiries', icon: MessageSquare, group: 'Operations' },
  { id: 'homepage', label: 'Homepage', icon: Layout, group: 'Content' },
  { id: 'about', label: 'About Me', icon: User, group: 'Content' },
  { id: 'services', label: 'Services', icon: ShieldCheck, group: 'Content' },
  { id: 'blog', label: 'Blog', icon: FileText, group: 'Content' },
  { id: 'gallery', label: 'Gallery', icon: Camera, group: 'Content' },
  { id: 'reviews', label: 'Reviews', icon: Star, group: 'Content' },
  { id: 'settings', label: 'Settings', icon: Settings, group: 'System' },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        apptsRes, hoursRes, settingsRes, servicesRes,
        reviewsRes, blogRes, inquiriesRes, galleryRes,
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
      if (hoursRes.ok) { const hData = await hoursRes.json(); setHours(hData.hours || []); }
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

  const navigateTab = (tab: string) => {
    setActiveTab(tab as TabId);
    setSidebarOpen(false);
  };

  const updateAppointmentStatus = async (id: string, newStatus: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
        showNotification(`Appointment marked as ${newStatus}`);
      }
    } catch { alert('Failed to update status'); }
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
    } catch { alert('Failed to delete appointment'); }
  };

  const saveHours = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/hours', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ hours }),
      });
      if (res.ok) showNotification('Clinic hours updated!');
    } catch { alert('Failed to save hours'); }
  };

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(clinicSettings),
      });
      if (res.ok) showNotification('Settings saved!');
    } catch { alert('Failed to save settings'); }
  };

  const toggleReviewApproval = async (id: string, isApproved: boolean) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isApproved }),
      });
      if (res.ok) {
        setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, isApproved } : r)));
        showNotification(`Review ${isApproved ? 'Approved' : 'Unapproved'}`);
      }
    } catch { alert('Failed to update review'); }
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
    } catch { alert('Failed to delete review'); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-espresso-950 flex items-center justify-center text-cream-100 text-sm animate-pulse font-serif">
        Loading Dr. Megha Abhijit Bobde's Clinic CMS...
      </div>
    );
  }

  const unreadInquiries = inquiries.filter((i: any) => !i.isRead).length;
  const pendingReviews = reviews.filter((r: any) => !r.isApproved).length;
  const groups = ['Overview', 'Operations', 'Content', 'System'];

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col text-espresso-950">
      {/* Header */}
      <header className="bg-espresso-950 text-white px-4 sm:px-6 py-3 border-b border-espresso-800 flex justify-between items-center sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg text-cream-300 hover:text-white hover:bg-espresso-800"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Logo variant="white" showSubtitle={false} />
          <div className="hidden sm:block border-l border-espresso-800 pl-3">
            <span className="text-[11px] font-semibold text-brand-300 block uppercase tracking-wider">
              Doctor CMS Portal
            </span>
            <span className="text-[10px] text-espresso-400">
              Dr. Megha Abhijit Bobde · MD, BHMS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="hidden sm:flex pill-btn text-xs text-cream-100 hover:text-white items-center gap-1.5 bg-espresso-900 hover:bg-espresso-800 px-3.5 py-1.5 rounded-full border border-espresso-700 transition-colors">
            <span>View Site</span><ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button onClick={handleLogout}
            className="pill-btn text-xs text-rose-300 hover:text-rose-100 flex items-center gap-1.5 bg-rose-950/40 hover:bg-rose-950/60 px-3.5 py-1.5 rounded-full border border-rose-900/40 transition-colors">
            <LogOut className="w-3.5 h-3.5" /><span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Toast Notification */}
      {statusMessage && (
        <div className="fixed top-16 right-6 z-50 bg-sage-800 text-white text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-sage-300" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Layout: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-espresso-950/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 top-[57px] z-30 w-56 bg-white border-r border-warm-200 flex flex-col transition-transform duration-200 ease-out overflow-y-auto`}>
          <nav className="flex-1 p-3 space-y-1">
            {groups.map((group) => {
              const groupTabs = TABS.filter((t) => t.group === group);
              return (
                <div key={group} className="py-2">
                  <span className="text-[10px] font-bold text-espresso-400 uppercase tracking-wider px-3 block mb-1.5">
                    {group}
                  </span>
                  {groupTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    const badge =
                      tab.id === 'inquiries' && unreadInquiries > 0 ? unreadInquiries
                      : tab.id === 'reviews' && pendingReviews > 0 ? pendingReviews
                      : null;

                    return (
                      <button
                        key={tab.id}
                        onClick={() => navigateTab(tab.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-brand-600 text-white shadow-sm'
                            : 'text-espresso-700 hover:bg-warm-100 hover:text-espresso-900'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="flex-1 text-left">{tab.label}</span>
                        {badge !== null && (
                          <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                            isActive ? 'bg-white/25 text-white' : 'bg-brand-100 text-brand-800'
                          }`}>
                            {badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardHome token={token} onNavigate={navigateTab} />
            )}

            {activeTab === 'appointments' && (
              <AppointmentsTab
                appointments={appointments}
                token={token}
                onUpdateStatus={updateAppointmentStatus}
                onDelete={deleteAppointment}
                showNotification={showNotification}
              />
            )}

            {activeTab === 'hours' && (
              <HoursTab hours={hours} setHours={setHours} onSave={saveHours} />
            )}

            {activeTab === 'gallery' && (
              <GalleryTab token={token} onRefresh={() => loadAllData(token!)} />
            )}

            {activeTab === 'settings' && (
              <SettingsTab
                clinicSettings={clinicSettings}
                setClinicSettings={setClinicSettings}
                onSave={saveSettings}
              />
            )}

            {activeTab === 'services' && (
              <ServicesTab
                services={services}
                token={token}
                onRefresh={() => loadAllData(token!)}
                showNotification={showNotification}
              />
            )}

            {activeTab === 'reviews' && (
              <ReviewsTab
                reviews={reviews}
                token={token}
                onToggleApproval={toggleReviewApproval}
                onDelete={deleteReview}
                showNotification={showNotification}
              />
            )}

            {activeTab === 'blog' && (
              <BlogTab
                blogPosts={blogPosts}
                token={token}
                onRefresh={() => loadAllData(token!)}
                showNotification={showNotification}
              />
            )}

            {activeTab === 'inquiries' && (
              <InquiriesTab
                inquiries={inquiries}
                token={token}
                showNotification={showNotification}
              />
            )}

            {activeTab === 'about' && (
              <AboutMeTab
                clinicSettings={clinicSettings}
                setClinicSettings={setClinicSettings}
                onSave={saveSettings}
                token={token}
              />
            )}

            {activeTab === 'homepage' && (
              <HomepageTab
                clinicSettings={clinicSettings}
                setClinicSettings={setClinicSettings}
                onSave={saveSettings}
                token={token}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
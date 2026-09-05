'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ShieldCheck, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@drmeghahomoeoclinic.com');
  const [password, setPassword] = useState('MeghaClinic@2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Authentication failed. Check your credentials.');
        return;
      }

      // Store token in localStorage
      localStorage.setItem('megha_clinic_admin_token', data.token);
      localStorage.setItem('megha_clinic_admin_user', JSON.stringify(data.user));

      router.push('/admin');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-espresso-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background warm glow */}
      <div className="absolute w-96 h-96 bg-brand-600/10 rounded-full blur-3xl -top-20 -left-20 pointer-events-none"></div>
      <div className="absolute w-96 h-96 bg-brand-500/10 rounded-full blur-3xl -bottom-20 -right-20 pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#FDFBF7] rounded-3xl p-8 sm:p-10 shadow-2xl border border-tan-200/80 space-y-6 relative z-10 text-espresso-950">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-white border border-brand-200 p-2 flex items-center justify-center mx-auto shadow-md">
            <Image
              src="/images/logo.png"
              alt="Dr. Megha Bobde Clinic Brand Mark"
              width={48}
              height={48}
              className="w-12 h-12 object-contain"
            />
          </div>
          <h1 className="font-serif text-2xl font-bold text-espresso-950">
            Doctor / CMS Portal
          </h1>
          <p className="text-xs text-espresso-600 font-medium">
            Dr. Megha Bobde's Homoeo Clinic · Bavdhan, Pune
          </p>
        </div>

        {/* Demo Credentials Helper Pill */}
        <div className="p-3.5 bg-[#FAF6F0] border border-tan-200 rounded-2xl text-xs text-espresso-800 space-y-1">
          <span className="font-bold flex items-center gap-1.5 text-brand-700">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            Authorized Access Only:
          </span>
          <p className="text-[11px] text-espresso-600 font-mono">
            Email: <strong className="text-espresso-900">admin@drmeghahomoeoclinic.com</strong><br/>
            Password: <strong className="text-espresso-900">MeghaClinic@2026</strong>
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-espresso-800 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-tan-200 rounded-xl text-espresso-900 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-espresso-800 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-tan-200 rounded-xl text-espresso-900 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="pill-btn w-full py-3.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2 mt-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Clinic CMS'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center">
          <Link href="/" className="text-xs text-brand-700 hover:text-brand-900 underline font-medium">
            &larr; Return to Public Website
          </Link>
        </div>

      </div>
    </div>
  );
}
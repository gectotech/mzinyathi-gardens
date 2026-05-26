'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Home,
  Sparkles,
  KeyRound,
} from 'lucide-react';
import toast from 'react-hot-toast';

const REMEMBER_KEY = 'mg_admin_remember_email';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState('');
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [shake, setShake] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  useEffect(() => {
    const saved = localStorage.getItem(REMEMBER_KEY);
    if (saved) {
      setEmail(saved);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    fetch('/api/auth')
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          router.replace(
            d.user.role === 'super_admin' ? '/admin/super' : '/admin/dashboard'
          );
        }
      })
      .finally(() => setCheckingSession(false));
  }, [router]);

  const triggerShake = useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!emailValid) {
      setError('Please enter a valid email address.');
      setEmailTouched(true);
      triggerShake();
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      triggerShake();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid email or password.');
        triggerShake();
        toast.error(data.error || 'Login failed');
        return;
      }

      if (rememberMe) {
        localStorage.setItem(REMEMBER_KEY, email.trim().toLowerCase());
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }

      toast.success(`Welcome back, ${data.user.name}`);
      router.push(
        data.user.role === 'super_admin' ? '/admin/super' : '/admin/dashboard'
      );
    } catch {
      setError('Unable to connect. Check your network and try again.');
      triggerShake();
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="flex flex-col items-center gap-4 text-white">
          <Loader2 className="w-10 h-10 animate-spin text-[#4169E1]" />
          <p className="text-sm text-gray-400">Checking session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel — desktop */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative overflow-hidden bg-[#0f172a]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('/images/hero1.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#4169E1]/80 via-[#0f172a]/90 to-[#DD3210]/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.08)_0%,_transparent_50%)]" />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 text-white w-full">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors mb-16">
              <Home size={16} />
              Back to website
            </Link>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium uppercase tracking-wider mb-6">
              <Sparkles size={14} className="text-[#DD3210]" />
              Staff Portal
            </div>
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight max-w-lg">
              Mzinyathi <span className="text-[#DD3210]">Gardens</span>
            </h1>
            <p className="mt-4 text-lg text-white/80 max-w-md leading-relaxed">
              Secure control panel for managing properties, enquiries, careers, media, and site content.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 max-w-md">
              {[
                { label: 'Encrypted sessions', icon: Shield },
                { label: 'Role-based access', icon: KeyRound },
              ].map(({ label, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3 backdrop-blur-sm"
                >
                  <Icon size={18} className="text-[#4169E1] shrink-0" />
                  <span className="text-sm text-white/90">{label}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-white/40">
              Authorised personnel only. All access is logged and monitored.
            </p>
          </div>
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#4169E1]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#DD3210]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className={`w-full max-w-md relative ${shake ? 'animate-shake' : ''}`}>
          {/* Mobile brand header */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-[#4169E1] text-sm mb-6">
              <Home size={14} />
              Back to website
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              Mzinyathi <span className="text-[#DD3210]">Gardens</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">Staff control panel</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 p-8 sm:p-10">
            <div className="mb-8">
              <div className="w-12 h-12 rounded-xl bg-[#4169E1]/10 flex items-center justify-center mb-5">
                <Lock className="text-[#4169E1]" size={22} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Sign in</h2>
              <p className="text-gray-500 text-sm mt-1">
                Enter your credentials to access the admin dashboard
              </p>
            </div>

            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-red-800 text-sm">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
                      emailTouched && !emailValid ? 'text-red-400' : 'text-gray-400'
                    }`}
                  />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50/50 text-gray-900 placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:bg-white ${
                      emailTouched && !emailValid
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-[#4169E1]/30 focus:border-[#4169E1]'
                    }`}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    onBlur={() => setEmailTouched(true)}
                    required
                    disabled={loading}
                  />
                  {emailTouched && emailValid && email && (
                    <CheckCircle2 size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500" />
                  )}
                </div>
                {emailTouched && !emailValid && email && (
                  <p className="mt-1.5 text-xs text-red-600">Enter a valid email address</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-xs text-[#4169E1] hover:text-[#DD3210] font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-[#4169E1]/30 focus:border-[#4169E1] focus:bg-white"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    onKeyDown={(e) => setCapsLockOn(e.getModifierState('CapsLock'))}
                    onKeyUp={(e) => setCapsLockOn(e.getModifierState('CapsLock'))}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {capsLockOn && (
                  <p className="mt-1.5 text-xs text-amber-600 flex items-center gap-1">
                    <AlertCircle size={12} />
                    Caps Lock is on
                  </p>
                )}
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#4169E1] focus:ring-[#4169E1]"
                  disabled={loading}
                />
                <span className="text-sm text-gray-600">Remember my email on this device</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#4169E1] hover:bg-[#3457c6] disabled:bg-[#4169E1]/70 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-[#4169E1]/25 hover:shadow-[#4169E1]/40 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in to dashboard
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
              <Shield size={14} />
              <span>Secured with encrypted JWT session cookies</span>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6 lg:hidden">
            Authorised staff only · Bulawayo, Zimbabwe
          </p>
        </div>
      </div>

      {/* Forgot password modal */}
      {showForgot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowForgot(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="forgot-title"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
              <KeyRound className="text-amber-600" size={22} />
            </div>
            <h3 id="forgot-title" className="text-xl font-bold text-gray-900">
              Reset your password
            </h3>
            <p className="text-gray-600 text-sm mt-2 leading-relaxed">
              Password resets are handled by a Super Admin. Contact your system administrator or
              email{' '}
              <a
                href="mailto:info@mzinyathigardens.co.zw"
                className="text-[#4169E1] hover:underline font-medium"
              >
                info@mzinyathigardens.co.zw
              </a>{' '}
              to request access.
            </p>
            <button
              onClick={() => setShowForgot(false)}
              className="mt-6 w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

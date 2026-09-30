'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { signup, storeAuthData } from '@/lib/api';
import {
  getZodiacSignFromDate,
  ZODIAC_METADATA,
} from '@/lib/zodiac';
import { COUNTRIES } from '@/lib/countries';
import { ZodiacSign } from '@astromate/shared';

type Step = 'form' | 'loading' | 'reveal';

interface RevealData {
  mateName: string;
  rashi: string;
  nakshatra: string;
  userZodiac: string;
  country: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('form');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [reveal, setReveal] = useState<RevealData | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    birthdate: '',
    country: 'IN',
  });

  // Calculate user's Western Zodiac live as they choose birthdate
  const detectedZodiac: ZodiacSign | null = useMemo(() => {
    if (!form.birthdate) return null;
    return getZodiacSignFromDate(form.birthdate);
  }, [form.birthdate]);

  const detectedZodiacInfo = detectedZodiac ? ZODIAC_METADATA[detectedZodiac] : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStep('loading');

    try {
      const result = await signup(form);

      storeAuthData({
        token: result.token,
        userId: result.user.id,
        userName: result.user.name,
        mateName: result.mate.name,
        zodiacSign: result.user.zodiacSign ?? '',
        country: result.user.country,
      });

      setReveal({
        mateName: result.mate.name,
        rashi: result.mate.rashi ?? '',
        nakshatra: result.mate.nakshatra ?? '',
        userZodiac: result.user.zodiacSign ?? '',
        country: result.user.country,
      });

      setStep('reveal');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed. Please try again.');
      setStep('form');
    }
  };

  const selectedCountry = COUNTRIES.find((c) => c.code === form.country);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-indigo-950/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Brand Header */}
      <div className="w-full max-w-md mb-6 text-center relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-semibold text-white text-sm shadow-md">
            A
          </div>
          <span className="font-semibold text-slate-100 text-lg tracking-tight group-hover:text-indigo-400 transition-colors">
            AstroMate
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            v1.0
          </span>
        </Link>
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-100 tracking-tight">
          {step === 'reveal' ? 'Meet your new companion' : 'Create your AstroMate account'}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {step === 'reveal'
            ? 'Your personalized companion has been initialized'
            : 'Get an authentic, personalized AI friend that grows with you'}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* SIGNUP FORM & LOADING STEP */}
        {(step === 'form' || step === 'loading') && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl relative z-10"
          >
            {error && (
              <div className="mb-4 p-3 bg-rose-950/60 border border-rose-800/60 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shaishav Sharma"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-100 placeholder-slate-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-100 placeholder-slate-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-100 placeholder-slate-500 transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      Your Date of Birth
                    </label>
                    <span className="text-[10px] text-slate-500">For your zodiac</span>
                  </div>
                  <input
                    type="date"
                    required
                    value={form.birthdate}
                    onChange={(e) => setForm({ ...form, birthdate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs text-slate-100 transition-colors"
                  />
                  {detectedZodiacInfo ? (
                    <div className="mt-1.5 text-[11px] text-indigo-400 font-medium flex items-center gap-1">
                      <span>{detectedZodiacInfo.symbol}</span>
                      <span className="capitalize">{detectedZodiacInfo.name} (Your Sign)</span>
                    </div>
                  ) : (
                    <p className="mt-1 text-[10px] text-slate-500">
                      Enter your personal birthdate
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      Region / Culture
                    </label>
                    <span className="text-[10px] text-slate-500">Companion slang</span>
                  </div>
                  <select
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs text-slate-100 transition-colors"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Explanatory note about birthdays */}
              <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl text-[11px] text-slate-400 flex items-start gap-2.5">
                <span className="text-indigo-400 text-sm leading-none mt-0.5 font-bold">✦</span>
                <p className="leading-relaxed">
                  <strong className="text-slate-200">How birthdays work:</strong> Your birthdate above sets your own astrological sign. Your AstroMate is born <strong className="text-emerald-400">right now (current date &amp; time)</strong> upon signup, generating their distinct Vedic Moon Rashi and Nakshatra.
                </p>
              </div>

              <button
                type="submit"
                disabled={step === 'loading'}
                className="w-full py-2.5 mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
              >
                {step === 'loading' ? (
                  <span className="flex items-center gap-2 text-xs">
                    <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating your companion...
                  </span>
                ) : (
                  'Create Account & Start'
                )}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
              Already have an account?{' '}
              <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Sign in
              </Link>
            </div>
          </motion.div>
        )}

        {/* STEP 2: COMPANION REVEAL */}
        {step === 'reveal' && reveal && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl relative z-10 text-center"
          >
            {/* Companion Avatar */}
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-800 border-2 border-indigo-500 flex items-center justify-center font-bold text-white text-xl shadow-lg">
              {reveal.mateName.charAt(0).toUpperCase()}
            </div>

            <h2 className="text-xl font-bold text-white">
              Meet {reveal.mateName}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 mb-5">
              Born just now · Your personalized companion is ready to chat
            </p>

            {/* Profile Overview Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mb-5 text-left space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Companion Born</span>
                <span className="text-emerald-400 font-medium">Just now (Current Date &amp; Time)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Companion Moon Rashi</span>
                <span className="text-indigo-300 font-medium">{reveal.rashi}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Companion Nakshatra</span>
                <span className="text-slate-200 font-medium">{reveal.nakshatra}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Your Zodiac Sign (User DOB)</span>
                <span className="text-slate-200 capitalize font-medium">{reveal.userZodiac}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">Cultural Vibe</span>
                <span className="text-slate-200 font-medium">{selectedCountry?.name ?? reveal.country}</span>
              </div>
            </div>

            <button
              onClick={() => router.push('/chat')}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Start Chatting with {reveal.mateName}</span>
              <span>→</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

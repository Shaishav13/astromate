'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { signup, storeAuthData } from '@/lib/api';
import { getZodiacEmoji, getZodiacDescription } from '@/lib/zodiac';
import { COUNTRIES } from '@/lib/countries';

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
  const [reveal, setReveal] = useState<RevealData | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    birthdate: '',
    country: 'IN',
  });

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
      setError(err instanceof Error ? err.message : 'Signup failed');
      setStep('form');
    }
  };

  const selectedCountry = COUNTRIES.find((c) => c.code === form.country);

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating stars */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute text-primary-200 text-xl pointer-events-none"
          style={{
            top: `${15 + i * 20}%`,
            left: i % 2 === 0 ? `${5 + i * 3}%` : undefined,
            right: i % 2 !== 0 ? `${5 + i * 3}%` : undefined,
          }}
          animate={{ y: [0, -8, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.7 }}
        >
          \u2b50
        </motion.div>
      ))}

      <AnimatePresence mode="wait">
        {/* SIGNUP FORM */}
        {(step === 'form' || step === 'loading') && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-sm"
          >
            <div className="text-center mb-6">
              <div className="text-5xl mb-2">\u2728</div>
              <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
              <p className="text-gray-500 text-sm mt-1">
                Your AstroMate is born the moment you sign up
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your name</label>
                  <input
                    type="text"
                    required
                    placeholder="What should we call you?"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your birthdate</label>
                  <input
                    type="date"
                    required
                    value={form.birthdate}
                    onChange={(e) => setForm({ ...form, birthdate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
                  />
                  <p className="text-xs text-gray-400 mt-1">Used for your zodiac sign</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your country</label>
                  <select
                    required
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm bg-white"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-400 mt-1">
                    Your buddy will speak your language \ud83d\ude0a
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={step === 'loading'}
                  className="w-full py-3 bg-gradient-to-r from-primary-600 to-accent-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-60 shadow-md"
                >
                  {step === 'loading' ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Summoning your AstroMate...
                    </span>
                  ) : (
                    'Create my AstroMate \u2728'
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-4">
                Already have an account?{' '}
                <Link href="/login" className="text-primary-600 font-medium hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </motion.div>
        )}

        {/* REVEAL STEP */}
        {step === 'reveal' && reveal && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="text-7xl mb-4"
            >
              \ud83c\udf1f
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Meet <span className="text-primary-600">{reveal.mateName}</span>!
              </h2>
              <p className="text-gray-500 text-sm mb-5">
                Born this very moment, just for you.
              </p>

              <div className="bg-white rounded-2xl shadow-xl p-5 border border-gray-100 mb-4 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Your zodiac</span>
                  <span className="font-medium text-gray-800 capitalize">
                    {getZodiacEmoji(reveal.userZodiac as any)} {reveal.userZodiac}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Buddy's Rashi</span>
                  <span className="font-medium text-gray-800">\ud83c\udf19 {reveal.rashi}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Buddy's Nakshatra</span>
                  <span className="font-medium text-gray-800">\u2b50 {reveal.nakshatra}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Speaks</span>
                  <span className="font-medium text-gray-800">
                    {selectedCountry?.name ?? reveal.country} style
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-400 mb-5">
                {getZodiacDescription(reveal.userZodiac as any)}
              </p>

              <button
                onClick={() => router.push('/chat')}
                className="w-full py-3 bg-gradient-to-r from-primary-600 to-accent-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-md"
              >
                Start chatting \u2192
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

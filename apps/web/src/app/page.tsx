'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { onboardUser } from '@/lib/api';
import { getZodiacEmoji, getZodiacDescription } from '@/lib/zodiac';
import { ZodiacSign } from '@astromate/shared';

type Step = 'form' | 'reveal' | 'loading';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('form');
  const [error, setError] = useState<string | null>(null);
  const [zodiacSign, setZodiacSign] = useState<ZodiacSign | null>(null);
  const [mateName, setMateName] = useState('');
  const [form, setForm] = useState({ name: '', email: '', birthdate: '' });

  // Redirect if already onboarded
  useEffect(() => {
    const userId = localStorage.getItem('astromate_user_id');
    if (userId) router.replace('/chat');
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStep('loading');

    try {
      const result = await onboardUser(form);

      // Store user data in localStorage
      localStorage.setItem('astromate_user_id', result.user.id);
      localStorage.setItem('astromate_user_name', result.user.name ?? form.name);
      localStorage.setItem('astromate_mate_name', result.mate.name);
      localStorage.setItem('astromate_zodiac', result.user.zodiacSign ?? '');

      setZodiacSign(result.user.zodiacSign as ZodiacSign);
      setMateName(result.mate.name);
      setStep('reveal');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Is the server running?'
      );
      setStep('form');
    }
  };

  const handleEnterChat = () => {
    router.push('/chat');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating star decorations */}
      {['top-10 left-10', 'top-20 right-16', 'bottom-20 left-20', 'bottom-10 right-10', 'top-1/2 left-6'].map(
        (pos, i) => (
          <motion.div
            key={i}
            className={`absolute ${pos} text-primary-200 text-2xl pointer-events-none`}
            animate={{ y: [0, -10, 0], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
          >
            \u2b50
          </motion.div>
        )
      )}

      <AnimatePresence mode="wait">
        {/* FORM STEP */}
        {(step === 'form' || step === 'loading') && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-sm"
          >
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="text-5xl mb-3">\u2728</div>
              <h1 className="text-3xl font-bold text-gray-900">AstroMate</h1>
              <p className="text-gray-500 mt-2 text-sm">
                Your AI best friend, powered by the stars
              </p>
            </div>

            {/* Form card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h2 className="font-semibold text-gray-800 mb-4">Let's get started</h2>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="What should we call you?"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Birthdate
                  </label>
                  <input
                    type="date"
                    required
                    value={form.birthdate}
                    onChange={(e) => setForm({ ...form, birthdate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm transition-all"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Used to generate your AstroMate's personality
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
                      Reading the stars...
                    </span>
                  ) : (
                    'Meet my AstroMate \u2728'
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* ZODIAC REVEAL STEP */}
        {step === 'reveal' && zodiacSign && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-sm text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="text-8xl mb-4"
            >
              {getZodiacEmoji(zodiacSign)}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 capitalize mb-1">
                You're a {zodiacSign}
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                {getZodiacDescription(zodiacSign)}
              </p>

              <div className="bg-white rounded-2xl shadow-xl p-5 border border-gray-100 mb-6">
                <div className="text-3xl mb-2">\ud83e\udd16</div>
                <p className="font-semibold text-gray-800">
                  Meet <span className="text-primary-600">{mateName}</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Your {zodiacSign}-coded AstroMate is ready. They're a little sarcastic. You'll love them.
                </p>
              </div>

              <button
                onClick={handleEnterChat}
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

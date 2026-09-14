'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('astromate_token');
    const userId = localStorage.getItem('astromate_user_id');
    if (token && userId) router.replace('/chat');
  }, [router]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Floating stars */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="absolute text-primary-200 pointer-events-none"
          style={{
            fontSize: `${16 + i * 6}px`,
            top: `${10 + i * 18}%`,
            left: i % 2 === 0 ? `${4 + i * 4}%` : undefined,
            right: i % 2 !== 0 ? `${4 + i * 4}%` : undefined,
          }}
          animate={{ y: [0, -12, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.6 }}
        >
          \u2b50
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-sm"
      >
        <div className="text-7xl mb-4">\u2728</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">AstroMate</h1>
        <p className="text-gray-500 text-base mb-2">
          Your AI best friend, born the moment you sign up.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          Powered by Vedic astrology. Speaks your language. Grows with you.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {['\ud83c\udf19 Vedic Astrology', '\ud83c\udf0d Your Language', '\ud83d\udc9c Evolving Bond', '\ud83e\udde0 Remembers You'].map((f) => (
            <span key={f} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
              {f}
            </span>
          ))}
        </div>

        <div className="space-y-3">
          <Link
            href="/signup"
            className="block w-full py-3 bg-gradient-to-r from-primary-600 to-accent-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-md"
          >
            Get started \u2728
          </Link>
          <Link
            href="/login"
            className="block w-full py-3 bg-white text-primary-600 font-semibold rounded-xl border border-primary-200 hover:bg-primary-50 transition-all"
          >
            Log in
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

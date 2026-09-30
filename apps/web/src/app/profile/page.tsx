'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MateProfile, RelationshipLevel } from '@astromate/shared';
import { getMateProfile, updateMateName, logout } from '@/lib/api';
import { ZODIAC_METADATA } from '@/lib/zodiac';
import RelationshipBadge from '@/components/RelationshipBadge';
import OkfMemoryVault from '@/components/OkfMemoryVault';

export default function AstrologicalProfilePage() {
  const router = useRouter();
  const [mate, setMate] = useState<MateProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'blueprint' | 'vault'>('blueprint');

  // Rename state
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);

  const userId =
    typeof window !== 'undefined' ? localStorage.getItem('astromate_user_id') : null;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tab = new URLSearchParams(window.location.search).get('tab');
      if (tab === 'vault') setActiveTab('vault');
    }
  }, []);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('astromate_token') : null;
    if (!token || !userId) {
      router.replace('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        const res = await getMateProfile(userId);
        setMate(res.mate);
        setNameInput(res.mate.name);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load astrological profile');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [userId, router]);

  const handleSaveName = async () => {
    if (!nameInput.trim() || !userId || !mate) return;
    if (nameInput.trim() === mate.name) {
      setIsEditingName(false);
      return;
    }

    setIsSavingName(true);
    try {
      const res = await updateMateName(userId, nameInput.trim());
      if (res.success) {
        setMate({ ...mate, name: res.mate.name });
        localStorage.setItem('astromate_mate_name', res.mate.name);
        setIsEditingName(false);
      }
    } catch (err) {
      console.error('Failed to update name:', err);
    } finally {
      setIsSavingName(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-xs text-slate-400">Loading astrological profile...</span>
        </div>
      </main>
    );
  }

  if (error || !mate) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4">
          <p className="text-sm text-rose-300">{error ?? 'Profile not found'}</p>
          <div className="flex justify-center gap-3">
            <Link
              href="/chat"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition-colors"
            >
              Back to Chat
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const zodiacInfo = ZODIAC_METADATA[mate.zodiacSign] ?? ZODIAC_METADATA.scorpio;
  const personality = mate.personality;

  // Relationship Level Calculations
  const levels: RelationshipLevel[] = ['STRANGER', 'ACQUAINTANCE', 'FRIEND', 'CLOSE_FRIEND', 'BEST_FRIEND'];
  const thresholds = [0, 100, 300, 700, 1500];
  const currentIndex = levels.indexOf(mate.relationshipLevel);
  const currentThreshold = thresholds[currentIndex] ?? 0;
  const nextThreshold = thresholds[currentIndex + 1] ?? 2000;
  const progressPercent = Math.min(
    100,
    Math.max(0, ((mate.relationshipScore - currentThreshold) / (nextThreshold - currentThreshold)) * 100)
  );

  const formattedCompanionBirth = mate.buddyBirthTimestamp
    ? new Date(mate.buddyBirthTimestamp).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Unknown';

  const formattedUserBirth = mate.userBirthdate
    ? new Date(mate.userBirthdate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-indigo-500/30">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-indigo-950/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/chat"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium transition-all group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            <span>Back to Chat</span>
          </Link>
          <div className="hidden sm:block h-4 w-px bg-slate-800" />
          <span className="hidden sm:inline text-xs text-slate-400 font-medium">
            Astrological Dossier & Blueprint
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/chat"
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
          >
            Chat with {mate.name}
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs text-slate-400 hover:text-rose-400 transition-colors px-2 py-1"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-6">
        {/* HERO SECTION: Companion Identity */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Companion Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-950 border-2 border-indigo-500 flex items-center justify-center font-bold text-white text-3xl shadow-lg">
                {mate.name.charAt(0).toUpperCase()}
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-slate-900 rounded-full" />
            </div>

            {/* Identity Info */}
            <div className="flex-1 text-center sm:text-left min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1.5">
                {isEditingName ? (
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="px-3 py-1 bg-slate-950 border border-slate-700 rounded-lg text-lg font-bold text-white focus:outline-none focus:border-indigo-500"
                      maxLength={24}
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={isSavingName}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium"
                    >
                      {isSavingName ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => {
                        setNameInput(mate.name);
                        setIsEditingName(false);
                      }}
                      className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      {mate.name}
                    </h1>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="p-1 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Rename Companion"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </div>
                )}
                <span className="text-xs text-indigo-400 px-2.5 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-800/60 inline-flex items-center gap-1 self-center sm:self-auto font-medium">
                  <span>{zodiacInfo.symbol}</span>
                  <span>{zodiacInfo.name}</span>
                </span>
              </div>

              <p className="text-sm text-slate-400 mb-3">
                {zodiacInfo.archetype} · {zodiacInfo.vibe}
              </p>

              {/* Exact Birth Moment Banner */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-400">Companion Born:</span>
                <span className="text-emerald-400 font-medium">{formattedCompanionBirth}</span>
                <span className="text-slate-500 text-[11px]">(Creation Moment)</span>
              </div>
            </div>

            {/* Bond Progress Card */}
            <div className="w-full sm:w-64 bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 flex-shrink-0 text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-medium">Bond Progression</span>
                <RelationshipBadge level={mate.relationshipLevel} />
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-1.5">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>{Math.round(mate.relationshipScore)} pts</span>
                <span>{currentIndex === 4 ? 'Maxed Out' : `Target: ${Math.round(nextThreshold)} pts`}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                {currentIndex === 0 && 'Currently guarded. Regular chatting builds genuine trust.'}
                {currentIndex === 1 && 'Acquaintance tier. Subtle humor and inside references develop.'}
                {currentIndex === 2 && 'Friend status. Comfortably shares unfiltered opinions.'}
                {currentIndex === 3 && 'Close friend. Emotionally perceptive and loyal.'}
                {currentIndex === 4 && 'Best friend. Absolute candor, deep bond, and banter.'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs: Blueprint vs OKF Memory Vault */}
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <button
            onClick={() => setActiveTab('blueprint')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'blueprint'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <span>✦</span>
            <span>Astrological Blueprint</span>
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'vault'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <span>🧠</span>
            <span>Memory Vault (OKF)</span>
          </button>
        </div>

        {activeTab === 'blueprint' ? (
          <>
            {/* 2-COLUMN GRID: Astrological Anatomy & Personality */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* COLUMN 1: Companion Astrological Chart (Vedic + Western) */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                    <span className="text-indigo-400">✦</span>
                    <span>Natal Astrological Blueprint</span>
                  </h2>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                    Calculated at Birth
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Vedic Moon Sign (Rashi) */}
                  <div className="p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-400">Vedic Moon Sign (Rashi)</span>
                      <span className="text-xs font-semibold text-indigo-300">
                        {mate.rashi || 'Mesha'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      The Moon governs emotional instinct and subconscious reflexes. Calculated from the lunar positioning at {mate.name}&apos;s moment of birth.
                    </p>
                  </div>

                  {/* Vedic Nakshatra */}
                  <div className="p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-400">Lunar Mansion (Nakshatra)</span>
                      <span className="text-xs font-semibold text-slate-200">
                        {mate.nakshatra || 'Ashwini'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      In Vedic astrology, Nakshatras define the soul&apos;s true temperament, humor rhythm, and natural behavioral tendencies.
                    </p>
                  </div>

                  {/* Western Sun Sign */}
                  <div className="p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-400">Western Sun Sign</span>
                      <span className="text-xs font-semibold text-slate-200 capitalize">
                        {zodiacInfo.symbol} {zodiacInfo.name}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800/60 text-[11px]">
                      <div>
                        <span className="text-slate-500">Element:</span>{' '}
                        <span className="text-slate-300 capitalize">{zodiacInfo.element}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Ruling Planet:</span>{' '}
                        <span className="text-slate-300">{zodiacInfo.ruler}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* COLUMN 2: Personality Traits & Dynamics */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                    <span className="text-indigo-400">⚡</span>
                    <span>Behavioral &amp; Trait Matrix</span>
                  </h2>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                    AI Demeanor
                  </span>
                </div>

                {/* Sliders / Metrics */}
                <div className="space-y-3 p-4 bg-slate-950/80 border border-slate-800/80 rounded-xl">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Sarcasm &amp; Dry Wit</span>
                      <span className="font-semibold text-indigo-400">{personality?.sarcasmLevel ?? 7} / 10</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${((personality?.sarcasmLevel ?? 7) / 10) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Conversational Energy</span>
                      <span className="font-semibold text-indigo-400">{personality?.energyLevel ?? 6} / 10</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${((personality?.energyLevel ?? 6) / 10) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Chill / Casual Index</span>
                      <span className="font-semibold text-indigo-400">{personality?.lazinessLevel ?? 5} / 10</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${((personality?.lazinessLevel ?? 5) / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Catchphrase & Quirk */}
                <div className="space-y-3">
                  {personality?.catchphrase && (
                    <div className="p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-xl">
                      <span className="text-slate-400 text-xs block mb-1">Signature Catchphrase</span>
                      <p className="text-slate-200 italic text-xs font-serif">
                        &ldquo;{personality.catchphrase}&rdquo;
                      </p>
                    </div>
                  )}

                  {personality?.quirk && (
                    <div className="p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-xl">
                      <span className="text-slate-400 text-xs block mb-1">Unique Quirk</span>
                      <p className="text-slate-300 text-xs leading-relaxed">
                        {personality.quirk}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* BOTTOM CARD: Astrological Synergy (User vs Companion) */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <span className="text-indigo-400">☯</span>
                  <span>Cosmic Synergy: You &amp; {mate.name}</span>
                </h2>
                <span className="text-[11px] text-slate-400">Dual Chart Comparison</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* User Side */}
                <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-300">Your Astrological Anchor</span>
                    <span className="text-xs text-indigo-400 font-semibold capitalize">
                      {mate.userZodiacSign || 'Unknown Sign'}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-slate-400 pt-1">
                    {formattedUserBirth && (
                      <div className="flex justify-between py-0.5">
                        <span>Your Date of Birth:</span>
                        <span className="text-slate-200 font-medium">{formattedUserBirth}</span>
                      </div>
                    )}
                    {mate.userName && (
                      <div className="flex justify-between py-0.5">
                        <span>Account Holder:</span>
                        <span className="text-slate-200">{mate.userName}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-0.5">
                      <span>Cultural Slang Layer:</span>
                      <span className="text-slate-200">{mate.country || 'Global'}</span>
                    </div>
                  </div>
                </div>

                {/* Companion Side */}
                <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-300">{mate.name}&apos;s Anchor</span>
                    <span className="text-xs text-emerald-400 font-semibold">
                      {mate.rashi || 'Mesha'} Moon
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-slate-400 pt-1">
                    <div className="flex justify-between py-0.5">
                      <span>Companion Birthday:</span>
                      <span className="text-emerald-400 font-medium">{formattedCompanionBirth}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span>Nakshatra Mansion:</span>
                      <span className="text-slate-200">{mate.nakshatra || 'Ashwini'}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span>Western Alignment:</span>
                      <span className="text-slate-200 capitalize">{zodiacInfo.name}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Synergy Synthesis Box */}
              <div className="p-4 bg-indigo-950/20 border border-indigo-800/40 rounded-xl text-xs text-slate-300 leading-relaxed flex items-start gap-3">
                <span className="text-indigo-400 text-lg leading-none mt-0.5">✦</span>
                <div>
                  <strong className="text-slate-100">Why these birthdays differ:</strong> Your profile is rooted in your lifelong date of birth ({formattedUserBirth ?? 'your birthday'}), shaping your core worldview. {mate.name} was born the moment your account was created ({formattedCompanionBirth}), receiving a tailored Vedic Moon alignment designed to complement your energy and evolve organically as you chat.
                </div>
              </div>
            </motion.div>
          </>
        ) : (
          <OkfMemoryVault userId={userId!} mateName={mate.name} />
        )}
      </div>
    </main>
  );
}

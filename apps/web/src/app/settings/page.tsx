'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MateProfile, RelationshipLevel } from '@astromate/shared';
import { getMateProfile, updateMateName, updateUserProfile, clearMessages, logout, getOkfExportUrl } from '@/lib/api';
import { ZODIAC_METADATA, WALLPAPERS, ZodiacInfo } from '@/lib/zodiac';
import RelationshipBadge from '@/components/RelationshipBadge';
import clsx from 'clsx';

export default function SettingsPage() {
  const router = useRouter();
  const [mate, setMate] = useState<MateProfile | null>(null);
  const [mateExtra, setMateExtra] = useState<{
    rashi?: string;
    nakshatra?: string;
    buddyBirthTimestamp?: string;
    userZodiacSign?: string;
    userBirthdate?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // User Profile state
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userCountry, setUserCountry] = useState('US');
  const [isEditingUserName, setIsEditingUserName] = useState(false);
  const [userNameInput, setUserNameInput] = useState('');
  const [isSavingUserName, setIsSavingUserName] = useState(false);

  // Companion renaming
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Wallpaper / Theme
  const [currentWallpaperId, setCurrentWallpaperId] = useState('default');

  const userId =
    typeof window !== 'undefined' ? localStorage.getItem('astromate_user_id') : null;

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('astromate_token') : null;
    if (!token || !userId) {
      router.replace('/login');
      return;
    }

    const savedWallpaper = localStorage.getItem('astromate_wallpaper');
    if (savedWallpaper) setCurrentWallpaperId(savedWallpaper);

    const loadSettings = async () => {
      try {
        const res = await getMateProfile(userId);
        setMate(res.mate);
        setNameInput(res.mate.name);
        const raw = res as any;
        setUserName(raw?.mate?.userName || raw?.userName || localStorage.getItem('astromate_user_name') || 'Explorer');
        setUserEmail(raw?.mate?.userEmail || raw?.userEmail || '');
        setUserCountry(raw?.mate?.country || raw?.country || 'US');
        setUserNameInput(raw?.mate?.userName || raw?.userName || localStorage.getItem('astromate_user_name') || '');
        setMateExtra({
          rashi: raw?.rashi,
          nakshatra: raw?.nakshatra,
          buddyBirthTimestamp: raw?.buddyBirthTimestamp,
          userZodiacSign: raw?.userZodiacSign,
          userBirthdate: raw?.userBirthdate,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load companion settings');
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [userId, router]);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleSelectWallpaper = (id: string) => {
    setCurrentWallpaperId(id);
    localStorage.setItem('astromate_wallpaper', id);
    const wp = WALLPAPERS.find((w) => w.id === id);
    showToast(`Atmosphere set to ${wp?.name || id}`);
  };

  const handleSaveCompanionName = async () => {
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
        showToast(`Companion renamed to ${res.mate.name}`);
      }
    } catch (err) {
      console.error('Failed to update companion name:', err);
    } finally {
      setIsSavingName(false);
    }
  };

  const handleSaveUserName = async () => {
    if (!userNameInput.trim() || !userId) {
      setIsEditingUserName(false);
      return;
    }
    if (userNameInput.trim() === userName) {
      setIsEditingUserName(false);
      return;
    }

    setIsSavingUserName(true);
    try {
      const res = await updateUserProfile(userId, { name: userNameInput.trim() });
      if (res.success) {
        setUserName(res.user.name);
        localStorage.setItem('astromate_user_name', res.user.name);
        setIsEditingUserName(false);
        showToast('Your user profile name updated');
      }
    } catch (err) {
      console.error('Failed to update user profile:', err);
    } finally {
      setIsSavingUserName(false);
    }
  };

  const handleClearChat = async () => {
    if (!userId) return;
    if (confirm('Clear entire chat conversation history? Your bond level and Open Knowledge memory files will remain preserved.')) {
      try {
        await clearMessages(userId);
        showToast('Chat history cleared successfully');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to clear chat');
      }
    }
  };

  const handleLogout = async () => {
    if (confirm('Sign out of AstroMate?')) {
      await logout();
      localStorage.removeItem('astromate_token');
      localStorage.removeItem('astromate_user_id');
      router.replace('/login');
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-xs text-slate-400">Loading settings & preferences...</span>
        </div>
      </main>
    );
  }

  if (error || !mate) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4">
          <h2 className="text-base font-semibold text-rose-400">Settings Unavailable</h2>
          <p className="text-xs text-slate-400">{error || 'Could not find your companion.'}</p>
          <Link
            href="/chat"
            className="inline-block py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
          >
            Return to Chat
          </Link>
        </div>
      </main>
    );
  }

  const companionZodiac = ZODIAC_METADATA[mate.zodiacSign] ?? ZODIAC_METADATA.scorpio;
  const userZodiacSignKey = (mateExtra.userZodiacSign?.toLowerCase() || 'scorpio') as keyof typeof ZODIAC_METADATA;
  const userZodiac: ZodiacInfo | undefined = ZODIAC_METADATA[userZodiacSignKey] || ZODIAC_METADATA.scorpio;

  // Relationship Progression calculation
  const levels: RelationshipLevel[] = ['STRANGER', 'ACQUAINTANCE', 'FRIEND', 'CLOSE_FRIEND', 'BEST_FRIEND'];
  const thresholds = [0, 100, 300, 700, 1500];
  const currentIndex = levels.indexOf(mate.relationshipLevel);
  const currentThreshold = thresholds[currentIndex] ?? 0;
  const nextThreshold = thresholds[currentIndex + 1] ?? 2000;
  const progressPercent = Math.min(
    100,
    Math.max(0, ((mate.relationshipScore - currentThreshold) / (nextThreshold - currentThreshold)) * 100)
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {successToast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-xs text-emerald-300 shadow-xl flex items-center gap-2"
        >
          <span className="text-emerald-400">✓</span>
          <span>{successToast}</span>
        </motion.div>
      )}

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/chat"
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all"
          >
            <span>←</span>
            <span>Back to Chat</span>
          </Link>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-xs text-slate-400 hidden sm:inline">Settings & Companion Hub</span>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/chat"
            className="py-1.5 px-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <span>Chat with {mate.name}</span>
          </Link>
          <button
            onClick={handleLogout}
            className="py-1.5 px-3 rounded-lg text-slate-400 hover:text-rose-400 text-xs transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Main Settings Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Companion Overview Hero Card */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 sm:p-7 relative overflow-hidden shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative z-10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-2xl text-slate-100 shadow-md">
                  {mate.name.charAt(0).toUpperCase()}
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full" />
              </div>

              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {!isEditingName ? (
                    <>
                      <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        {mate.name}
                      </h1>
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="p-1 rounded text-slate-400 hover:text-indigo-400 transition-colors"
                        title="Rename companion"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="bg-slate-800 border border-indigo-500 rounded px-2.5 py-1 text-sm text-white focus:outline-none w-36"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveCompanionName}
                        disabled={isSavingName}
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium"
                      >
                        {isSavingName ? '...' : 'Save'}
                      </button>
                      <button
                        onClick={() => setIsEditingName(false)}
                        className="px-2 py-1 bg-slate-800 text-slate-400 rounded text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-medium">
                    {companionZodiac.symbol} {companionZodiac.name}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  {companionZodiac.archetype} · {companionZodiac.vibe}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>
                    Companion Born: {mateExtra.buddyBirthTimestamp ? new Date(mateExtra.buddyBirthTimestamp).toLocaleString() : 'Creation Moment'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bond Progress Gauge */}
            <div className="w-full sm:w-60 bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Bond Status</span>
                <RelationshipBadge level={mate.relationshipLevel} />
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>{Math.round(mate.relationshipScore)} pts</span>
                <span>{currentIndex === 4 ? 'Max' : `${Math.round(nextThreshold)} pts target`}</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION: USER PROFILE & COORDINATES */}
        <div className="space-y-4">
          <div className="border-b border-slate-800/80 pb-2 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-200 tracking-tight flex items-center gap-2">
                <span>👤</span>
                <span>User Profile & Celestial Coordinates</span>
              </h2>
              <p className="text-xs text-slate-400">
                Your personal account details, human birthdate, and astrological baseline
              </p>
            </div>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 font-mono">
              Account Active
            </span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-6">
            {/* Top row: Name, Email, Avatar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/70">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-lg text-indigo-300 shadow">
                  {(userName || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  {!isEditingUserName ? (
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-white">
                        {userName || 'Astro Explorer'}
                      </h3>
                      <button
                        onClick={() => {
                          setUserNameInput(userName);
                          setIsEditingUserName(true);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-indigo-400 transition-colors"
                        title="Edit profile name"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={userNameInput}
                        onChange={(e) => setUserNameInput(e.target.value)}
                        className="bg-slate-800 border border-indigo-500 rounded px-2.5 py-1 text-xs text-white focus:outline-none w-40"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveUserName}
                        disabled={isSavingUserName}
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium"
                      >
                        {isSavingUserName ? '...' : 'Save'}
                      </button>
                      <button
                        onClick={() => setIsEditingUserName(false)}
                        className="px-2 py-1 bg-slate-800 text-slate-400 rounded text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-slate-400 mt-0.5 font-mono">
                    {userEmail || 'Account active'}
                  </p>
                </div>
              </div>

              {userZodiac && (
                <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-lg">{userZodiac.symbol}</span>
                  <div className="text-left">
                    <span className="text-xs font-medium text-slate-200 block capitalize">
                      {userZodiac.name}
                    </span>
                    <span className="text-[10px] text-slate-500 capitalize">
                      {userZodiac.element} Element · {userZodiac.ruler}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Grid of User Coordinates */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-3.5 space-y-1">
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">
                  Your Date of Birth
                </span>
                <span className="text-xs font-semibold text-slate-200 block">
                  {mateExtra.userBirthdate
                    ? new Date(mateExtra.userBirthdate).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'Set at signup'}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Human birthday (distinct from buddy)
                </span>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-3.5 space-y-1">
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">
                  Cultural Region
                </span>
                <span className="text-xs font-semibold text-slate-200 block">
                  {userCountry === 'IN' ? 'India (IN) · Hinglish' : `${userCountry} (Global)`}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Companion conversation context
                </span>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-3.5 space-y-1">
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">
                  Plan & Subscription
                </span>
                <span className="text-xs font-semibold text-emerald-400 block">
                  Celestial Free Tier
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Unlimited local private chats
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Companion Hub (Memory Vault & Astro Profile) */}
        <div className="space-y-4">
          <div className="border-b border-slate-800/80 pb-2">
            <h2 className="text-sm font-semibold text-slate-200 tracking-tight">
              Companion Hub & Knowledge
            </h2>
            <p className="text-xs text-slate-400">
              Access your companion&apos;s open knowledge base and astrological coordinates
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1: Memory Vault (OKF) */}
            <Link
              href="/profile?tab=vault"
              className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl">
                    🧠
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                    OKF/1.0 Standard
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-100 group-hover:text-emerald-300 transition-colors">
                    Memory Vault (OKF)
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Transparent, human-readable Markdown files with YAML frontmatter. Inspect, edit, search, and download your companion&apos;s memories.
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-slate-800/60 flex items-center justify-between text-xs font-medium text-emerald-400 group-hover:text-emerald-300">
                <span>Open Memory Vault</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>

            {/* Card 2: Astrological Blueprint */}
            <Link
              href="/profile"
              className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-lg font-bold">
                    ✦
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800/60">
                    Vedic & Western
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                    Astrological Blueprint
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Explore {mate.name}&apos;s Moon Rashi ({mateExtra.rashi || 'Mesha'}), Nakshatra ({mateExtra.nakshatra || 'Ashwini'}), ruling planet, and cosmic harmony.
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-slate-800/60 flex items-center justify-between text-xs font-medium text-indigo-400 group-hover:text-indigo-300">
                <span>View Full Blueprint</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Section: Appearance & Atmosphere (Theme Selector) */}
        <div className="space-y-4">
          <div className="border-b border-slate-800/80 pb-2">
            <h2 className="text-sm font-semibold text-slate-200 tracking-tight">
              Atmosphere & Themes
            </h2>
            <p className="text-xs text-slate-400">
              Customize the visual backdrop and cosmic ambiance for your conversations
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            {WALLPAPERS.map((wallpaper) => {
              const isSelected = currentWallpaperId === wallpaper.id;
              return (
                <button
                  key={wallpaper.id}
                  onClick={() => handleSelectWallpaper(wallpaper.id)}
                  className={clsx(
                    'group relative rounded-2xl overflow-hidden h-28 p-0.5 transition-all text-left flex flex-col justify-between',
                    isSelected
                      ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-950 shadow-[0_0_20px_rgba(99,102,241,0.25)]'
                      : 'hover:scale-[1.01] border border-slate-800/80 hover:border-slate-700'
                  )}
                >
                  <div
                    className="w-full h-full rounded-[14px] p-3 flex flex-col justify-between relative overflow-hidden"
                    style={{ background: wallpaper.preview }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    <div className="relative z-10 flex items-center justify-between">
                      {isSelected ? (
                        <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold shadow">
                          ✓
                        </span>
                      ) : (
                        <span />
                      )}
                    </div>

                    <div className="relative z-10">
                      <span className="text-xs font-semibold text-white tracking-wide block">
                        {wallpaper.name}
                      </span>
                      <span className="text-[10px] text-slate-300">
                        {isSelected ? 'Active Atmosphere' : 'Click to Apply'}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section: Data, Memory Export & Danger Zone */}
        <div className="space-y-4">
          <div className="border-b border-slate-800/80 pb-2">
            <h2 className="text-sm font-semibold text-slate-200 tracking-tight">
              Data Management & Session
            </h2>
            <p className="text-xs text-slate-400">
              Export memories, clear message threads, or manage your account session
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl divide-y divide-slate-800/60 overflow-hidden">
            {/* Export Memory Bundle */}
            {userId && (
              <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs sm:text-sm font-medium text-slate-200">
                    Export Open Knowledge Bundle
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Download a standalone, portable `.okf.md` archive of all memories stored by {mate.name}.
                  </p>
                </div>
                <a
                  href={getOkfExportUrl(userId)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5 flex-shrink-0"
                >
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Export .md</span>
                </a>
              </div>
            )}

            {/* Clear Chat History */}
            <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs sm:text-sm font-medium text-slate-200">
                  Clear Chat Conversation
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Wipe current messages in the chat feed. Relationship points and memory snapshots will be preserved.
                </p>
              </div>
              <button
                onClick={handleClearChat}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 text-slate-300 hover:text-white text-xs font-medium transition-colors flex-shrink-0"
              >
                Clear History
              </button>
            </div>

            {/* Sign Out */}
            <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs sm:text-sm font-medium text-rose-300">
                  Sign Out
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  End your current session on this device.
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="px-3.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-950/70 border border-rose-900/50 text-rose-300 hover:text-rose-200 text-xs font-medium transition-colors flex-shrink-0"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

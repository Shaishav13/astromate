'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ChatMessage, MateProfile, RelationshipLevel } from '@astromate/shared';
import { sendMessage, getMessages, clearMessages, getMateProfile, updateMateName, logout } from '@/lib/api';
import { WALLPAPERS, ZODIAC_METADATA } from '@/lib/zodiac';
import ChatBubble from '@/components/ChatBubble';
import TypingIndicator from '@/components/TypingIndicator';
import MateHeader from '@/components/MateHeader';
import WallpaperPicker from '@/components/WallpaperPicker';
import MateDossierModal from '@/components/MateDossierModal';
import RelationshipBadge from '@/components/RelationshipBadge';
import clsx from 'clsx';

const CONVERSATION_PROMPTS = [
  'Give me a quick vibe check today',
  "What does today's energy feel like?",
  'Roast my sign with love',
  'What do you remember about me?',
  'Tell me your secret quirk',
];

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [mate, setMate] = useState<MateProfile | null>(null);
  const [mateExtra, setMateExtra] = useState<{
    rashi?: string;
    nakshatra?: string;
    buddyBirthTimestamp?: string;
    userZodiacSign?: string;
    userBirthdate?: string;
  }>({});
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wallpaperId, setWallpaperId] = useState('default');
  const [showWallpaper, setShowWallpaper] = useState(false);
  const [showDossier, setShowDossier] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [levelUpToast, setLevelUpToast] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const userId =
    typeof window !== 'undefined'
      ? localStorage.getItem('astromate_user_id')
      : null;

  // Auth guard
  useEffect(() => {
    const token = localStorage.getItem('astromate_token');
    if (!token || !userId) {
      router.replace('/login');
      return;
    }
    const saved = localStorage.getItem('astromate_wallpaper');
    if (saved) setWallpaperId(saved);
  }, [userId, router]);

  // Initial data load
  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      try {
        const [messagesRes, mateRes] = await Promise.all([
          getMessages(userId),
          getMateProfile(userId),
        ]);
        setMessages(messagesRes.messages);
        setMate(mateRes.mate);
        const raw = mateRes as any;
        setMateExtra({
          rashi: raw?.rashi,
          nakshatra: raw?.nakshatra,
          buddyBirthTimestamp: raw?.buddyBirthTimestamp,
          userZodiacSign: raw?.userZodiacSign,
          userBirthdate: raw?.userBirthdate,
        });
      } catch (err) {
        if (err instanceof Error && err.message.includes('401')) {
          router.replace('/login');
        } else {
          setError(err instanceof Error ? err.message : 'Unable to connect to your companion');
        }
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [userId, router]);

  // Poll for proactive messages
  const pollMessages = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await getMessages(userId);
      setMessages((prev) =>
        res.messages.length > prev.length ? res.messages : prev
      );
    } catch {}
  }, [userId]);

  useEffect(() => {
    pollRef.current = setInterval(pollMessages, 5000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [pollMessages]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (messageText?: string) => {
    const text = (messageText ?? input).trim();
    if (!text || !userId || isTyping) return;

    setInput('');
    setIsTyping(true);
    setError(null);

    const tempMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: 'USER',
      content: text,
      isProactive: false,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const res = await sendMessage(userId, text);
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempMsg.id),
        { ...tempMsg, id: `user-${Date.now()}` },
        res.message,
      ]);

      if (res.relationshipUpdate.leveledUp) {
        const labels: Record<RelationshipLevel, string> = {
          STRANGER: 'Strangers',
          ACQUAINTANCE: 'Acquaintances',
          FRIEND: 'Friends',
          CLOSE_FRIEND: 'Close Friends',
          BEST_FRIEND: 'Best Friends',
        };
        setLevelUpToast(`Bond Level Up: You are now ${labels[res.relationshipUpdate.newLevel]}`);
        setTimeout(() => setLevelUpToast(null), 4000);
        getMateProfile(userId).then((r) => setMate(r.mate)).catch(() => {});
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes('401')) {
        router.replace('/login');
        return;
      }
      setError(err instanceof Error ? err.message : 'Message failed to send');
      setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
    } finally {
      setIsTyping(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = async () => {
    if (!userId) return;
    if (confirm('Clear chat history? Your relationship progress and memory files are preserved.')) {
      try {
        await clearMessages(userId);
        setMessages([]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to clear chat');
      }
    }
  };

  const handleLogout = async () => {
    if (confirm('Sign out of AstroMate?')) {
      try {
        await logout();
      } catch {
        // ignore
      } finally {
        localStorage.removeItem('astromate_token');
        localStorage.removeItem('astromate_user_id');
        router.replace('/login');
      }
    }
  };

  const handleRenameMate = async (newName: string) => {
    if (!userId) return;
    const res = await updateMateName(userId, newName);
    if (res.success && mate) {
      setMate({ ...mate, name: res.mate.name });
    }
  };

  const handleWallpaperSelect = (id: string) => {
    setWallpaperId(id);
    localStorage.setItem('astromate_wallpaper', id);
  };

  const currentWallpaper = WALLPAPERS.find((w) => w.id === wallpaperId) ?? WALLPAPERS[0];
  const mateZodiac = mate ? (ZODIAC_METADATA[mate.zodiacSign] ?? ZODIAC_METADATA.scorpio) : null;

  // Relationship Progression calculation
  const levels: RelationshipLevel[] = ['STRANGER', 'ACQUAINTANCE', 'FRIEND', 'CLOSE_FRIEND', 'BEST_FRIEND'];
  const thresholds = [0, 100, 300, 700, 1500];
  const currentIndex = mate ? levels.indexOf(mate.relationshipLevel) : 0;
  const currentThreshold = thresholds[currentIndex] ?? 0;
  const nextThreshold = thresholds[currentIndex + 1] ?? 2000;
  const progressPercent = mate
    ? Math.min(100, Math.max(0, ((mate.relationshipScore - currentThreshold) / (nextThreshold - currentThreshold)) * 100))
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Loading conversation...</p>
        </div>
      </div>
    );
  }

  // Refined, grounded sidebar component
  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-4">
        {/* Companion Card */}
        {mate && mateZodiac && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-slate-800 border border-slate-700/80 flex items-center justify-center font-semibold text-slate-200 text-sm shadow-sm flex-shrink-0">
                {mate.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-100 text-sm truncate">
                    {mate.name}
                  </h3>
                  <span className="text-xs text-slate-400">
                    · {mateZodiac.name}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {mateZodiac.archetype}
                </p>
              </div>
            </div>

            {/* Relationship Progress */}
            <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Bond Level</span>
                <RelationshipBadge level={mate.relationshipLevel} />
              </div>

              <div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>{Math.round(mate.relationshipScore)} pts</span>
                  <span>{currentIndex === 4 ? 'Max level' : `${Math.round(nextThreshold)} pts`}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                {currentIndex === 0 && 'Currently guarded. Regular conversations build trust.'}
                {currentIndex === 1 && 'Slightly warmer. Inside jokes and dry humor emerge.'}
                {currentIndex === 2 && 'Comfortable and open. Shares candid thoughts freely.'}
                {currentIndex === 3 && 'Close and supportive. Invested in your daily life.'}
                {currentIndex === 4 && 'Best friend status. Deep loyalty and complete candor.'}
              </p>
            </div>

            {/* Settings & Knowledge Hub Link to /settings */}
            <Link
              href="/settings"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800/80 hover:border-slate-700 text-slate-200 text-xs font-medium transition-all group shadow-sm text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:text-indigo-300 flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors">
                    Settings & Hub
                  </div>
                  <div className="text-[10px] text-slate-400 font-normal">
                    Memory Vault, Blueprint & Options
                  </div>
                </div>
              </div>
              <span className="text-slate-500 group-hover:text-slate-300 transition-colors text-sm">
                →
              </span>
            </Link>
          </div>
        )}
      </div>

      {/* Footer Navigation with Theme and Sign Out */}
      <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
        {/* Theme button moved from header to sidebar */}
        <button
          onClick={() => setShowWallpaper(true)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/60 text-xs text-slate-300 hover:text-white transition-all text-left"
          title="Change Atmosphere Theme"
        >
          <span className="flex items-center gap-2 truncate">
            <svg className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="truncate">Theme: {currentWallpaper.name}</span>
          </span>
          <span className="text-slate-500 text-[10px] flex-shrink-0">Change</span>
        </button>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <Link
            href="/settings"
            className="hover:text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <span>⚙️ Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="hover:text-rose-400 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen h-[100dvh] max-h-[100dvh] w-full flex bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* 1. DESKTOP SIDEBAR (Collapsible) */}
      <aside
        className={clsx(
          'h-full bg-slate-900 border-r border-slate-800/80 overflow-y-auto chat-scroll flex-col flex-shrink-0 z-20 transition-all duration-300 ease-in-out',
          isSidebarCollapsed
            ? 'w-0 p-0 border-r-0 overflow-hidden hidden'
            : 'hidden lg:flex w-72 xl:w-80 p-5'
        )}
      >
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-800/60">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-100 text-sm tracking-tight">
              AstroMate
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500">v1.0</span>
            <button
              onClick={() => setIsSidebarCollapsed(true)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Collapse Sidebar"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </div>
        <SidebarContent />
      </aside>

      {/* 2. MOBILE DRAWER */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 bottom-0 left-0 w-80 max-w-[85vw] bg-slate-900 border-r border-slate-800 p-5 z-50 overflow-y-auto chat-scroll lg:hidden flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="font-semibold text-slate-100 text-sm">
                  AstroMate Companion
                </span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 3. MAIN CHAT AREA */}
      <main className="flex-1 flex flex-col h-full min-h-0 min-w-0 relative overflow-hidden bg-slate-950">
        {/* Header */}
        {mate && (
          <MateHeader
            mate={mate}
            rashi={mateExtra.rashi}
            nakshatra={mateExtra.nakshatra}
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleDesktopSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
            onToggleSidebar={() => setMobileSidebarOpen(true)}
            onClearChat={handleClearChat}
            onLogout={handleLogout}
          />
        )}

        {/* Level Up Toast */}
        <AnimatePresence>
          {levelUpToast && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="absolute top-14 left-1/2 -translate-x-1/2 z-30 bg-slate-800 text-slate-100 text-xs font-medium px-4 py-2 rounded-full shadow-lg border border-slate-700 whitespace-nowrap flex items-center gap-2"
            >
              <span className="text-emerald-400">●</span>
              <span>{levelUpToast}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Feed Scroll Area (Optimized for Mobile Touch & Elastic Scrolling) */}
        <div
          className={clsx(
            'flex-1 min-h-0 overflow-y-auto overflow-x-hidden chat-scroll relative overscroll-contain',
            currentWallpaper.style
          )}
          style={{
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y',
          }}
        >
          {/* Centered Content Container */}
          <div className="max-w-2xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 min-h-full flex flex-col justify-between relative z-10">
            {/* Top spacer when messages are few to keep them near bottom smoothly */}
            {messages.length > 0 && <div className="flex-1 min-h-[16px]" />}

            {/* Empty State */}
            {messages.length === 0 && mateZodiac && (
              <div className="my-auto flex-1 flex flex-col items-center justify-center text-center p-6">
                <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mb-3 text-slate-200 font-semibold text-base shadow-sm">
                  {mate?.name.charAt(0).toUpperCase()}
                </div>

                <h3 className="font-semibold text-slate-100 text-base mb-1">
                  Chat with {mate?.name}
                </h3>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-6">
                  {mateZodiac.name} companion. Start a conversation naturally—your bond deepens over time.
                </p>

                {/* Suggestions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-sm">
                  {CONVERSATION_PROMPTS.slice(0, 4).map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(prompt)}
                      className="px-3 py-2 rounded-lg bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 text-left text-xs text-slate-300 transition-colors"
                    >
                      <span className="truncate block">{prompt}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages Feed (Natural, unconstrained scroll flow) */}
            {messages.length > 0 && (
              <div className="flex flex-col w-full space-y-2.5 pb-2">
                {messages.map((msg) => (
                  <ChatBubble
                    key={msg.id}
                    message={msg}
                    isUser={msg.role === 'USER'}
                    mateName={mate?.name}
                    mateSymbol={mateZodiac?.symbol}
                  />
                ))}

                <AnimatePresence>
                  {isTyping && <TypingIndicator />}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="px-4 py-2 bg-rose-950/80 border-t border-rose-900 text-rose-300 text-xs flex items-center justify-between z-20 flex-shrink-0">
            <span>{error}</span>
            {error.includes('Ollama') && (
              <code className="bg-rose-900/50 px-2 py-0.5 rounded text-[11px] font-mono text-rose-200">
                ollama serve
              </code>
            )}
          </div>
        )}

        {/* Suggested Prompts (Clean horizontal pills) */}
        <div className="w-full bg-slate-950/90 border-t border-slate-800/60 z-20 flex-shrink-0">
          <div className="max-w-2xl w-full mx-auto px-4 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {CONVERSATION_PROMPTS.map((promptText, i) => (
              <button
                key={i}
                onClick={() => handleSend(promptText)}
                disabled={isTyping}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-[11px] text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-40"
              >
                {promptText}
              </button>
            ))}
          </div>
        </div>

        {/* Main Input Bar */}
        <div className="w-full bg-slate-950 border-t border-slate-800/80 z-20 flex-shrink-0">
          <div className="max-w-2xl w-full mx-auto p-3 sm:p-4">
            <div className="relative flex items-center">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message ${mate?.name ?? 'your companion'}...`}
                rows={1}
                disabled={isTyping}
                className="w-full bg-slate-900/90 text-slate-100 placeholder-slate-500 rounded-xl pl-4 pr-12 py-3 text-xs sm:text-sm resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500/50 border border-slate-800/80 transition-all disabled:opacity-50"
                style={{ maxHeight: '120px' }}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-30 disabled:hover:bg-indigo-600 transition-all flex items-center justify-center shadow-sm"
                title="Send message"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 mt-1.5">
              <span className="hidden sm:inline">Press Enter to send · Shift+Enter for new line</span>
              <span className="sm:hidden">Tap Send to chat</span>
              <span>{mate ? `Connected with ${mate.name}` : ''}</span>
            </div>
          </div>
        </div>

        {/* Wallpaper Picker Modal */}
        <WallpaperPicker
          isOpen={showWallpaper}
          currentWallpaper={wallpaperId}
          onSelect={handleWallpaperSelect}
          onClose={() => setShowWallpaper(false)}
        />

        {/* Astrological Dossier Modal */}
        {mate && (
          <MateDossierModal
            isOpen={showDossier}
            onClose={() => setShowDossier(false)}
            mate={mate}
            rashi={mateExtra.rashi}
            nakshatra={mateExtra.nakshatra}
            onRename={handleRenameMate}
          />
        )}
      </main>
    </div>
  );
}

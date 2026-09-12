'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { ChatMessage, MateProfile, RelationshipLevel } from '@astromate/shared';
import { sendMessage, getMessages, getMateProfile } from '@/lib/api';
import { WALLPAPERS } from '@/lib/zodiac';
import ChatBubble from '@/components/ChatBubble';
import TypingIndicator from '@/components/TypingIndicator';
import MateHeader from '@/components/MateHeader';
import WallpaperPicker from '@/components/WallpaperPicker';
import clsx from 'clsx';

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [mate, setMate] = useState<MateProfile | null>(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wallpaperId, setWallpaperId] = useState('default');
  const [showWallpaper, setShowWallpaper] = useState(false);
  const [levelUpToast, setLevelUpToast] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const userId =
    typeof window !== 'undefined'
      ? localStorage.getItem('astromate_user_id')
      : null;

  // Redirect if not onboarded
  useEffect(() => {
    if (!userId) {
      router.replace('/');
      return;
    }

    // Load saved wallpaper
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
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load chat data'
        );
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [userId]);

  // Poll for new messages every 5 seconds (catches proactive messages)
  const pollMessages = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await getMessages(userId);
      setMessages((prev) => {
        if (res.messages.length > prev.length) {
          return res.messages;
        }
        return prev;
      });
    } catch {
      // Silent fail for polling
    }
  }, [userId]);

  useEffect(() => {
    pollRef.current = setInterval(pollMessages, 5000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [pollMessages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !userId || isTyping) return;

    setInput('');
    setIsTyping(true);
    setError(null);

    // Optimistically add user message
    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: 'USER',
      content: text,
      isProactive: false,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await sendMessage(userId, text);

      // Replace temp message and add AI response
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempUserMsg.id),
        { ...tempUserMsg, id: `user-${Date.now()}` },
        res.message,
      ]);

      // Handle level-up
      if (res.relationshipUpdate.leveledUp) {
        const newLevel = res.relationshipUpdate.newLevel;
        const labels: Record<RelationshipLevel, string> = {
          STRANGER: 'Stranger',
          ACQUAINTANCE: 'Acquaintance',
          FRIEND: 'Friend',
          CLOSE_FRIEND: 'Close Friend',
          BEST_FRIEND: 'Best Friend',
        };
        setLevelUpToast(`You're now ${labels[newLevel]}s! \u2b50`);
        setTimeout(() => setLevelUpToast(null), 4000);

        // Refresh mate profile
        getMateProfile(userId)
          .then((r) => setMate(r.mate))
          .catch(() => {});
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to send message'
      );
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleWallpaperSelect = (id: string) => {
    setWallpaperId(id);
    localStorage.setItem('astromate_wallpaper', id);
  };

  const currentWallpaper = WALLPAPERS.find((w) => w.id === wallpaperId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-chat-bg">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-pulse-slow">\u2728</div>
          <p className="text-gray-500 text-sm">Loading your AstroMate...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-white shadow-xl relative">
      {/* Header */}
      {mate && (
        <MateHeader
          mate={mate}
          onWallpaperClick={() => setShowWallpaper(true)}
        />
      )}

      {/* Level-up toast */}
      <AnimatePresence>
        {levelUpToast && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-gradient-to-r from-primary-600 to-accent-500 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg">
            {levelUpToast}
          </div>
        )}
      </AnimatePresence>

      {/* Chat area */}
      <div
        className={clsx(
          'flex-1 overflow-y-auto chat-scroll px-4 py-4 flex flex-col gap-0.5',
          currentWallpaper?.style ?? 'bg-chat-bg'
        )}
      >
        {messages.length === 0 && !isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">\ud83d\udc4b</div>
              <p className="text-sm">Say hi to {mate?.name ?? 'your AstroMate'}!</p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            message={msg}
            isUser={msg.role === 'USER'}
          />
        ))}

        <AnimatePresence>
          {isTyping && <TypingIndicator />}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Error banner */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-100 text-red-600 text-xs">
          {error}
          {error.includes('Ollama') && (
            <span className="ml-1 font-medium">Run: ollama serve</span>
          )}
        </div>
      )}

      {/* Input bar */}
      <div className="px-4 py-3 bg-white border-t border-gray-100 flex items-end gap-2">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message ${mate?.name ?? 'AstroMate'}...`}
          rows={1}
          className="flex-1 resize-none px-4 py-2.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm transition-all max-h-32 overflow-y-auto"
          style={{ lineHeight: '1.5' }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-primary-600 to-accent-500 text-white rounded-full flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-40 shadow-md"
          aria-label="Send message"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </div>

      {/* Wallpaper picker */}
      <WallpaperPicker
        isOpen={showWallpaper}
        currentWallpaper={wallpaperId}
        onSelect={handleWallpaperSelect}
        onClose={() => setShowWallpaper(false)}
      />
    </div>
  );
}

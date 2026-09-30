'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { MateProfile } from '@astromate/shared';
import { ZODIAC_METADATA, WALLPAPERS } from '@/lib/zodiac';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  mate: MateProfile | null;
  rashi?: string;
  nakshatra?: string;
  currentWallpaperId: string;
  onOpenWallpaperPicker: () => void;
  onRenameCompanion?: (newName: string) => Promise<void>;
  onClearChat?: () => void;
  onLogout: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  mate,
  rashi,
  nakshatra,
  currentWallpaperId,
  onOpenWallpaperPicker,
  onRenameCompanion,
  onClearChat,
  onLogout,
}: SettingsModalProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(mate?.name || '');
  const [isSavingName, setIsSavingName] = useState(false);

  const zodiac = mate ? (ZODIAC_METADATA[mate.zodiacSign] ?? ZODIAC_METADATA.scorpio) : null;
  const currentWallpaper = WALLPAPERS.find((w) => w.id === currentWallpaperId) ?? WALLPAPERS[0];

  const handleSaveName = async () => {
    if (!nameInput.trim() || !onRenameCompanion || nameInput.trim() === mate?.name) {
      setIsEditingName(false);
      return;
    }
    setIsSavingName(true);
    try {
      await onRenameCompanion(nameInput.trim());
      setIsEditingName(false);
    } catch {
      // ignore
    } finally {
      setIsSavingName(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden relative z-10 text-slate-100 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">Settings & Companion Hub</h3>
                  <p className="text-[11px] text-slate-400">Manage knowledge files, astrology profile, and appearance</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-6 space-y-6 overflow-y-auto chat-scroll flex-1">
              {/* Section 1: Companion Memory & Blueprint Options */}
              <div className="space-y-3">
                <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
                  Companion Intelligence & Profile
                </span>

                <div className="grid grid-cols-1 gap-2.5">
                  {/* Memory Vault Option */}
                  <Link
                    href="/profile?tab=vault"
                    onClick={onClose}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/80 hover:border-emerald-500/40 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-lg flex-shrink-0">
                        🧠
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-slate-200 text-xs group-hover:text-emerald-300 transition-colors">
                            Memory Vault (OKF)
                          </h4>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-mono">
                            Open Knowledge
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                          Inspect, edit, search, and export {mate?.name || 'companion'}&apos;s long-term memory markdown files and YAML frontmatter.
                        </p>
                      </div>
                    </div>
                    <span className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all text-sm ml-2">
                      →
                    </span>
                  </Link>

                  {/* Astrological Blueprint Option */}
                  <Link
                    href="/profile"
                    onClick={onClose}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/80 hover:border-indigo-500/40 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-sm flex-shrink-0 font-bold">
                        ✦
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-slate-200 text-xs group-hover:text-indigo-300 transition-colors">
                            Astrological Blueprint
                          </h4>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                            Vedic & Western
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                          Explore {mate?.name || 'companion'}&apos;s full Moon Rashi ({rashi || 'Mesha'}), Nakshatra ({nakshatra || 'Ashwini'}), and celestial traits.
                        </p>
                      </div>
                    </div>
                    <span className="text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all text-sm ml-2">
                      →
                    </span>
                  </Link>
                </div>
              </div>

              {/* Section 2: Atmosphere & Theme */}
              <div className="space-y-3">
                <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
                  Appearance & Atmosphere
                </span>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg border border-slate-700/80 shadow-inner flex items-center justify-center text-xs"
                      style={{ background: currentWallpaper.preview }}
                    />
                    <div>
                      <h4 className="font-medium text-slate-200 text-xs">Chat Atmosphere</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Current: <strong className="text-slate-300">{currentWallpaper.name}</strong>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenWallpaperPicker();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
                  >
                    Change Theme
                  </button>
                </div>
              </div>

              {/* Section 3: Companion Customization */}
              {mate && (
                <div className="space-y-3">
                  <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
                    Companion Identity
                  </span>

                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Name</span>
                      {!isEditingName ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white">{mate.name}</span>
                          {onRenameCompanion && (
                            <button
                              onClick={() => {
                                setNameInput(mate.name);
                                setIsEditingName(true);
                              }}
                              className="text-[11px] text-indigo-400 hover:underline"
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            className="bg-slate-800 border border-indigo-500 rounded px-2 py-0.5 text-xs text-white focus:outline-none w-28"
                            autoFocus
                          />
                          <button
                            onClick={handleSaveName}
                            disabled={isSavingName}
                            className="px-2 py-0.5 bg-indigo-600 text-white rounded text-[11px]"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setIsEditingName(false)}
                            className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-[11px]"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/60">
                      <span className="text-slate-400">Zodiac Archetype</span>
                      <span className="text-slate-300 font-medium">{zodiac?.archetype || 'Loyal Companion'}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/60">
                      <span className="text-slate-400">Bond Level</span>
                      <span className="text-slate-300 capitalize">{mate.relationshipLevel.toLowerCase().replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Section 4: Chat Management & Session */}
              <div className="space-y-3">
                <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
                  Data & Session
                </span>

                <div className="flex items-center justify-between gap-3">
                  {onClearChat && (
                    <button
                      onClick={() => {
                        onClose();
                        onClearChat();
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Clear Chat</span>
                    </button>
                  )}

                  <button
                    onClick={onLogout}
                    className="flex-1 py-2 px-3 rounded-xl bg-rose-950/30 hover:bg-rose-950/60 border border-rose-900/40 text-rose-300 hover:text-rose-200 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <span>AstroMate v1.0 · Open Knowledge Standard</span>
              <button
                onClick={onClose}
                className="px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

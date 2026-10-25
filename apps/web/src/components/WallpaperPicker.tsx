'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { WALLPAPERS } from '@/lib/zodiac';
import clsx from 'clsx';

interface WallpaperPickerProps {
  isOpen: boolean;
  currentWallpaper: string;
  onSelect: (wallpaperId: string) => void;
  onClose: () => void;
}

export default function WallpaperPicker({
  isOpen,
  currentWallpaper,
  onSelect,
  onClose,
}: WallpaperPickerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Bottom Sheet / Modal */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-0 left-0 right-0 max-w-xl mx-auto z-50 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 rounded-t-3xl p-5 sm:p-6 shadow-2xl text-slate-100 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-indigo-400">✧</span>
                  <h3 className="font-semibold text-base tracking-wide text-white">
                    Cosmic Atmospheres
                  </h3>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Choose a vibrant ambient theme for your companion conversations
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Close"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {WALLPAPERS.map((wallpaper) => {
                const isSelected = currentWallpaper === wallpaper.id;
                return (
                  <button
                    key={wallpaper.id}
                    onClick={() => {
                      onSelect(wallpaper.id);
                      onClose();
                    }}
                    className={clsx(
                      'group relative rounded-2xl overflow-hidden h-28 p-0.5 transition-all text-left flex flex-col justify-between shadow-sm',
                      isSelected
                        ? 'shadow-lg scale-[1.02]'
                        : 'hover:scale-[1.02] border border-slate-800/80 hover:border-slate-700'
                    )}
                    style={
                      isSelected
                        ? {
                            boxShadow: `0 0 0 2px ${wallpaper.accentColor}, 0 0 16px ${wallpaper.accentColor}40`,
                          }
                        : undefined
                    }
                  >
                    <div
                      className="w-full h-full rounded-[14px] p-2.5 flex flex-col justify-between relative overflow-hidden"
                      style={{ background: wallpaper.preview }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                      {/* Top row: color dot & selected indicator */}
                      <div className="relative z-10 flex items-center justify-between">
                        <span
                          className="w-2.5 h-2.5 rounded-full shadow-sm"
                          style={{ backgroundColor: wallpaper.accentColor }}
                        />
                        {isSelected && (
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center text-white shadow-md text-[10px] font-bold"
                            style={{ backgroundColor: wallpaper.accentColor }}
                          >
                            ✓
                          </div>
                        )}
                      </div>

                      {/* Bottom info */}
                      <div className="relative z-10">
                        <span className="text-xs font-semibold text-white tracking-wide block truncate">
                          {wallpaper.name}
                        </span>
                        <span className="text-[10px] text-slate-300 line-clamp-1 opacity-90 block mt-0.5">
                          {wallpaper.tagline}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

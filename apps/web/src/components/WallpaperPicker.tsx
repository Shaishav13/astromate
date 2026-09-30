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
            className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto z-50 bg-cosmic-900 border-t border-purple-500/20 rounded-t-3xl p-6 shadow-2xl text-slate-100"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="text-purple-400">✧</span>
                <h3 className="font-cinzel text-base font-bold tracking-wide text-white">
                  Cosmic Atmospheres
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
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
                      'group relative rounded-2xl overflow-hidden h-24 p-0.5 transition-all text-left',
                      isSelected
                        ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-cosmic-950 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                        : 'hover:scale-[1.02] border border-white/10'
                    )}
                  >
                    <div
                      className="w-full h-full rounded-[14px] p-2 flex flex-col justify-end relative overflow-hidden"
                      style={{ background: wallpaper.preview }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <span className="relative z-10 text-[11px] font-medium text-white tracking-wide">
                        {wallpaper.name}
                      </span>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center shadow-md">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
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

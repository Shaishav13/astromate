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
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Chat Wallpaper</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {WALLPAPERS.map((wallpaper) => (
                <button
                  key={wallpaper.id}
                  onClick={() => {
                    onSelect(wallpaper.id);
                    onClose();
                  }}
                  className={clsx(
                    'relative rounded-xl overflow-hidden h-20 transition-all',
                    currentWallpaper === wallpaper.id
                      ? 'ring-2 ring-primary-500 ring-offset-2'
                      : 'hover:scale-105'
                  )}
                >
                  <div
                    className="w-full h-full"
                    style={{ background: wallpaper.preview }}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-black/30 text-white text-[10px] py-1 text-center">
                    {wallpaper.name}
                  </div>
                  {currentWallpaper === wallpaper.id && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

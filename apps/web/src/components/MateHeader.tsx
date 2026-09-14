'use client';

import { MateProfile } from '@astromate/shared';
import { getZodiacEmoji } from '@/lib/zodiac';
import RelationshipBadge from './RelationshipBadge';

interface MateHeaderProps {
  mate: MateProfile;
  rashi?: string;
  nakshatra?: string;
  onWallpaperClick: () => void;
  onLogout: () => void;
}

export default function MateHeader({
  mate,
  rashi,
  nakshatra,
  onWallpaperClick,
  onLogout,
}: MateHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shadow-sm">
      {/* Left: Avatar + Info */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
            {mate.name.charAt(0)}
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-gray-900 text-sm">{mate.name}</span>
            <span className="text-base" title={mate.zodiacSign}>
              {getZodiacEmoji(mate.zodiacSign)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <RelationshipBadge level={mate.relationshipLevel} />
            {rashi && (
              <span className="text-[10px] text-gray-400">
                \ud83c\udf19 {rashi} {nakshatra ? `\u00b7 \u2b50 ${nakshatra}` : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={onWallpaperClick}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-primary-600"
          title="Change wallpaper"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>

        <button
          onClick={onLogout}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-red-500"
          title="Logout"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>
  );
}

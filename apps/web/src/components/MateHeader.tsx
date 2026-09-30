'use client';

import Link from 'next/link';
import { MateProfile } from '@astromate/shared';
import { ZODIAC_METADATA } from '@/lib/zodiac';
import RelationshipBadge from './RelationshipBadge';

interface MateHeaderProps {
  mate: MateProfile;
  rashi?: string;
  nakshatra?: string;
  isSidebarCollapsed?: boolean;
  onToggleDesktopSidebar?: () => void;
  onToggleSidebar?: () => void;
  onClearChat?: () => void;
  onLogout: () => void;
}

export default function MateHeader({
  mate,
  isSidebarCollapsed,
  onToggleDesktopSidebar,
  onToggleSidebar,
  onClearChat,
}: MateHeaderProps) {
  const zodiacInfo = ZODIAC_METADATA[mate.zodiacSign] ?? ZODIAC_METADATA.scorpio;

  return (
    <header className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 relative z-20 flex-shrink-0">
      {/* Left: Sidebar Toggle & Companion Summary */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        {/* Mobile Drawer Toggle */}
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors flex-shrink-0"
            title="Toggle Menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        {/* Desktop Sidebar Collapse / Expand Toggle */}
        {onToggleDesktopSidebar && (
          <button
            type="button"
            onClick={onToggleDesktopSidebar}
            className="hidden lg:flex p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors flex-shrink-0 items-center justify-center"
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {isSidebarCollapsed ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h8m-8 6h16" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              )}
            </svg>
          </button>
        )}

        {/* Companion Avatar & Title (click views profile) */}
        <Link
          href="/profile"
          className="flex items-center gap-2.5 text-left group transition-all min-w-0"
          title="View Astrological Profile"
        >
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-semibold text-slate-200 text-xs shadow-sm">
              {mate.name.charAt(0).toUpperCase()}
            </div>
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 border border-slate-900 rounded-full" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-100 text-sm group-hover:text-indigo-400 transition-colors truncate">
                {mate.name}
              </span>
              <span className="text-xs text-slate-400 hidden xs:inline truncate">
                ({zodiacInfo.name})
              </span>
            </div>

            <div className="flex items-center gap-1.5 mt-0.5">
              <RelationshipBadge level={mate.relationshipLevel} />
            </div>
          </div>
        </Link>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Clear chat history */}
        {onClearChat && (
          <button
            onClick={onClearChat}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/40 text-xs font-medium transition-all"
            title="Clear Chat History"
          >
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>
    </header>
  );
}

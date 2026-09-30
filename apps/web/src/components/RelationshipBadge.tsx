'use client';

import clsx from 'clsx';
import { getRelationshipEmoji, getRelationshipLabel, getRelationshipColor } from '@/lib/zodiac';
import { RelationshipLevel } from '@astromate/shared';

interface RelationshipBadgeProps {
  level: RelationshipLevel;
  score?: number;
  showScore?: boolean;
}

export default function RelationshipBadge({
  level,
  score,
  showScore = false,
}: RelationshipBadgeProps) {
  return (
    <div className="inline-flex items-center gap-1.5">
      <span
        className={clsx(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium backdrop-blur-md transition-all',
          getRelationshipColor(level)
        )}
      >
        <span className="text-xs">{getRelationshipEmoji(level)}</span>
        <span className="tracking-wide">{getRelationshipLabel(level)}</span>
      </span>
      {showScore && score !== undefined && (
        <span className="text-[11px] text-slate-400 font-mono">{Math.round(score)} pts</span>
      )}
    </div>
  );
}

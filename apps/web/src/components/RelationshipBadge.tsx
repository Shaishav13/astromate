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
    <div className="flex items-center gap-1.5">
      <span
        className={clsx(
          'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
          getRelationshipColor(level)
        )}
      >
        <span>{getRelationshipEmoji(level)}</span>
        <span>{getRelationshipLabel(level)}</span>
      </span>
      {showScore && score !== undefined && (
        <span className="text-xs text-gray-400">{Math.round(score)} pts</span>
      )}
    </div>
  );
}

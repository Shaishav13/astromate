import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MateProfile, RelationshipLevel } from '@astromate/shared';
import { ZODIAC_METADATA, getRelationshipLabel } from '@/lib/zodiac';

interface MateDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  mate: MateProfile;
  rashi?: string;
  nakshatra?: string;
  onRename?: (newName: string) => Promise<void>;
}

export default function MateDossierModal({
  isOpen,
  onClose,
  mate,
  rashi,
  nakshatra,
  onRename,
}: MateDossierModalProps) {
  const zodiacInfo = ZODIAC_METADATA[mate.zodiacSign] ?? ZODIAC_METADATA.scorpio;
  const personality = mate.personality;

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(mate.name);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEditName(mate.name);
  }, [mate.name]);

  const handleSaveName = async () => {
    if (!editName.trim() || editName.trim() === mate.name) {
      setIsEditing(false);
      return;
    }
    if (onRename) {
      setIsSaving(true);
      try {
        await onRename(editName.trim());
        setIsEditing(false);
      } catch (err) {
        console.error('Failed to rename companion:', err);
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Compute relationship stage progress
  const levels: RelationshipLevel[] = ['STRANGER', 'ACQUAINTANCE', 'FRIEND', 'CLOSE_FRIEND', 'BEST_FRIEND'];
  const thresholds = [0, 100, 300, 700, 1500];
  const currentIndex = levels.indexOf(mate.relationshipLevel);
  const currentThreshold = thresholds[currentIndex] ?? 0;
  const nextThreshold = thresholds[currentIndex + 1] ?? 2000;
  const progressPercent = Math.min(
    100,
    Math.max(0, ((mate.relationshipScore - currentThreshold) / (nextThreshold - currentThreshold)) * 100)
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100 relative overflow-hidden max-h-[88vh] overflow-y-auto chat-scroll"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-5 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-semibold text-slate-100 text-sm shadow-sm flex-shrink-0">
                    {mate.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    {!isEditing ? (
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-semibold text-white">
                          {mate.name}
                        </h2>
                        <span className="text-xs text-slate-400 capitalize">
                          ({zodiacInfo.name})
                        </span>
                        {onRename && (
                          <button
                            onClick={() => setIsEditing(true)}
                            className="p-1 text-slate-400 hover:text-indigo-400 transition-colors"
                            title="Rename Companion"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveName();
                            if (e.key === 'Escape') setIsEditing(false);
                          }}
                          className="bg-slate-800 border border-indigo-500/60 rounded px-2 py-0.5 text-xs text-white focus:outline-none"
                          placeholder="Companion name"
                          autoFocus
                        />
                        <button
                          onClick={handleSaveName}
                          disabled={isSaving}
                          className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-medium transition-colors"
                        >
                          {isSaving ? '...' : 'Save'}
                        </button>
                        <button
                          onClick={() => {
                            setEditName(mate.name);
                            setIsEditing(false);
                          }}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-slate-400 mt-0.5">
                      {zodiacInfo.archetype}
                    </p>
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

              {/* Relationship Section */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-400">
                    Relationship: <strong className="text-slate-200">{getRelationshipLabel(mate.relationshipLevel)}</strong>
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {Math.round(mate.relationshipScore)} / {nextThreshold} pts
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-indigo-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mt-1.5">
                  <span>Stage {currentIndex + 1} of 5</span>
                  <span>
                    {currentIndex === 4
                      ? 'Highest bond achieved'
                      : `${Math.round(nextThreshold - mate.relationshipScore)} pts to next level`}
                  </span>
                </div>
              </div>

              {/* Astrological Blueprint Grid */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 mb-4 space-y-2.5 text-xs">
                <h4 className="text-[11px] font-medium text-slate-400 block mb-1">
                  Astrological Coordinates
                </h4>

                <div className="flex justify-between py-1 border-b border-slate-800/50">
                  <span className="text-slate-500">Western Zodiac</span>
                  <span className="text-slate-200 capitalize">{zodiacInfo.name} ({zodiacInfo.element})</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-800/50">
                  <span className="text-slate-500">Vedic Moon Rashi</span>
                  <span className="text-slate-200">{rashi || 'Mesha'}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-800/50">
                  <span className="text-slate-500">Nakshatra</span>
                  <span className="text-slate-200">{nakshatra || 'Ashwini'}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-800/50">
                  <span className="text-slate-500">Ruling Planet</span>
                  <span className="text-slate-200">{zodiacInfo.ruler}</span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Messages Exchanged</span>
                  <span className="text-slate-200">{mate.totalInteractions}</span>
                </div>
              </div>

              {/* Personality Notes */}
              {personality && (
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-2 text-xs">
                  <h4 className="text-[11px] font-medium text-slate-400 block mb-1">
                    Personality Traits
                  </h4>

                  <div className="flex justify-between py-1 border-b border-slate-800/50">
                    <span className="text-slate-500">Communication Style</span>
                    <span className="text-slate-200 capitalize">{personality.communicationStyle || 'Candid & witty'}</span>
                  </div>

                  {personality.catchphrase && (
                    <div className="pt-1">
                      <span className="text-slate-500 text-[11px] block">Catchphrase</span>
                      <p className="text-slate-300 italic text-[11px] mt-0.5">
                        &ldquo;{personality.catchphrase}&rdquo;
                      </p>
                    </div>
                  )}

                  {personality.quirk && (
                    <div className="pt-1">
                      <span className="text-slate-500 text-[11px] block">Quirk</span>
                      <p className="text-slate-300 text-[11px] mt-0.5">
                        {personality.quirk}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

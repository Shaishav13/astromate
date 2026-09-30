'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  OkfMemoryItem,
  OkfMemoryType,
  OkfMemoryCategory,
  CreateOkfMemoryRequest,
} from '@astromate/shared';
import {
  getOkfMemories,
  createOkfMemory,
  updateOkfMemory,
  deleteOkfMemory,
  getOkfExportUrl,
} from '@/lib/api';

interface OkfMemoryVaultProps {
  userId: string;
  mateName: string;
}

const TYPE_CONFIG: Record<
  OkfMemoryType,
  { label: string; color: string; icon: string; bg: string }
> = {
  preference: {
    label: 'Preference',
    color: 'text-amber-400 border-amber-500/30',
    bg: 'bg-amber-950/40',
    icon: '☕',
  },
  milestone: {
    label: 'Milestone',
    color: 'text-emerald-400 border-emerald-500/30',
    bg: 'bg-emerald-950/40',
    icon: '🚩',
  },
  inside_joke: {
    label: 'Inside Joke',
    color: 'text-pink-400 border-pink-500/30',
    bg: 'bg-pink-950/40',
    icon: '🎭',
  },
  celestial_observation: {
    label: 'Astro Observation',
    color: 'text-indigo-400 border-indigo-500/30',
    bg: 'bg-indigo-950/40',
    icon: '✦',
  },
  personal_fact: {
    label: 'Personal Fact',
    color: 'text-cyan-400 border-cyan-500/30',
    bg: 'bg-cyan-950/40',
    icon: '📝',
  },
};

export default function OkfMemoryVault({ userId, mateName }: OkfMemoryVaultProps) {
  const [memories, setMemories] = useState<OkfMemoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Raw OKF preview modal / toggle per card
  const [expandedRawId, setExpandedRawId] = useState<string | null>(null);

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<OkfMemoryItem | null>(null);
  const [formState, setFormState] = useState<CreateOkfMemoryRequest>({
    type: 'preference',
    category: 'lifestyle',
    title: '',
    tags: [],
    content: '',
  });
  const [tagsInput, setTagsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchVault = async () => {
    try {
      setIsLoading(true);
      const res = await getOkfMemories(userId);
      setMemories(res.memories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load memory vault');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVault();
  }, [userId]);

  const filteredMemories = useMemo(() => {
    return memories.filter((m) => {
      const matchesType = selectedType === 'all' || m.type === selectedType;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        m.title.toLowerCase().includes(q) ||
        m.content.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q));
      return matchesType && matchesSearch;
    });
  }, [memories, selectedType, searchQuery]);

  const handleOpenAddModal = () => {
    setEditingMemory(null);
    setFormState({
      type: 'preference',
      category: 'lifestyle',
      title: '',
      tags: [],
      content: '',
    });
    setTagsInput('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: OkfMemoryItem) => {
    setEditingMemory(item);
    setFormState({
      type: item.type,
      category: item.category,
      title: item.title,
      tags: item.tags,
      content: item.content,
    });
    setTagsInput(item.tags.join(', '));
    setIsModalOpen(true);
  };

  const handleDelete = async (memoryId: string, title: string) => {
    if (!confirm(`Delete memory: "${title}"?`)) return;
    try {
      await deleteOkfMemory(userId, memoryId);
      setMemories((prev) => prev.filter((m) => m.id !== memoryId));
    } catch (err) {
      alert('Failed to delete memory');
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title.trim() || !formState.content.trim()) return;

    setIsSubmitting(true);
    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    try {
      if (editingMemory) {
        const res = await updateOkfMemory(userId, editingMemory.id, {
          ...formState,
          tags: parsedTags,
        });
        setMemories((prev) =>
          prev.map((m) => (m.id === editingMemory.id ? res.memory : m))
        );
      } else {
        const res = await createOkfMemory(userId, {
          ...formState,
          tags: parsedTags,
        });
        setMemories((prev) => [res.memory, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert('Failed to save memory item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const exportUrl = getOkfExportUrl(userId);

  return (
    <div className="space-y-6">
      {/* Top Controls & Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-indigo-400 font-bold">🧠</span>
              <h2 className="text-base font-bold text-white tracking-tight">
                {mateName}&apos;s Open Knowledge Vault (OKF)
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 font-mono">
                OKF/1.0 Standard
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Structured, transparent memory files. You can inspect, edit, or export everything {mateName} knows about you.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={exportUrl}
              download
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
              title="Download raw Markdown + YAML bundle"
            >
              <span>Export OKF Bundle (.md)</span>
              <span>↓</span>
            </a>

            <button
              onClick={handleOpenAddModal}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shadow-sm flex items-center gap-1.5"
            >
              <span>+ Add Knowledge Note</span>
            </button>
          </div>
        </div>

        {/* Filter Chips & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1">
          {/* Type Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                selectedType === 'all'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                  : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              All ({memories.length})
            </button>
            {(Object.keys(TYPE_CONFIG) as OkfMemoryType[]).map((type) => {
              const cfg = TYPE_CONFIG[type];
              const count = memories.filter((m) => m.type === type).length;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    selectedType === type
                      ? 'bg-slate-800 text-white border-slate-600 shadow-sm'
                      : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span>{cfg.icon}</span>
                  <span>{cfg.label}</span>
                  <span className="text-[10px] text-slate-500 font-mono">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-64 flex-shrink-0">
            <input
              type="text"
              placeholder="Search knowledge & tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 pl-8 bg-slate-950/90 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <svg
              className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Memory Cards Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 text-xs">
          Loading Open Knowledge units...
        </div>
      ) : filteredMemories.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-12 text-center space-y-3">
          <span className="text-2xl">📭</span>
          <p className="text-xs text-slate-400">
            {searchQuery || selectedType !== 'all'
              ? 'No matching knowledge units found.'
              : `${mateName} hasn't recorded memories in this category yet. Chat more or add a note above!`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMemories.map((item) => {
            const cfg = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.personal_fact;
            const isRawExpanded = expandedRawId === item.id;

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/90 border border-slate-800/90 hover:border-slate-700/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all group"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{cfg.icon}</span>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[10px]">
                          <span
                            className={`px-1.5 py-0.5 rounded border font-medium uppercase tracking-wider ${cfg.color} ${cfg.bg}`}
                          >
                            {cfg.label}
                          </span>
                          <span className="text-slate-500 font-mono">
                            {new Date(item.updatedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800"
                        title="Edit Note"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800"
                        title="Delete (Forget)"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="text-xs text-slate-300 leading-relaxed space-y-1 mb-3 pt-1">
                    {item.content.split('\n').map((line, idx) => {
                      if (!line.trim()) return null;
                      if (line.startsWith('#')) return null;
                      return (
                        <p key={idx} className="flex items-start gap-1.5">
                          {line.startsWith('-') ? (
                            <>
                              <span className="text-indigo-400 mt-0.5">•</span>
                              <span>{line.replace(/^-\s*/, '')}</span>
                            </>
                          ) : (
                            <span>{line}</span>
                          )}
                        </p>
                      );
                    })}
                  </div>

                  {/* Tags */}
                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950 text-slate-400 border border-slate-800 font-mono"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Raw OKF YAML Collapsible Inspector */}
                  <div className="pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() =>
                        setExpandedRawId(isRawExpanded ? null : item.id)
                      }
                      className="text-[10px] text-slate-500 hover:text-indigo-300 flex items-center gap-1 font-mono transition-colors"
                    >
                      <span>{isRawExpanded ? '▲ Hide' : '▼ Inspect'} Raw OKF YAML</span>
                    </button>

                    <AnimatePresence>
                      {isRawExpanded && item.rawOkf && (
                        <motion.pre
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 p-3 bg-slate-950 border border-slate-800 rounded-xl text-[10px] font-mono text-emerald-400/90 overflow-x-auto whitespace-pre-wrap leading-relaxed"
                        >
                          {item.rawOkf}
                        </motion.pre>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl text-slate-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>✦</span>
                  <span>
                    {editingMemory ? 'Edit Knowledge Unit' : 'Add Knowledge Note'}
                  </span>
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-200 text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitForm} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      Knowledge Type
                    </label>
                    <select
                      value={formState.type}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          type: e.target.value as OkfMemoryType,
                        })
                      }
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                    >
                      <option value="preference">Preference</option>
                      <option value="personal_fact">Personal Fact</option>
                      <option value="milestone">Milestone</option>
                      <option value="inside_joke">Inside Joke</option>
                      <option value="celestial_observation">Astro Observation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      Category
                    </label>
                    <select
                      value={formState.category}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          category: e.target.value as OkfMemoryCategory,
                        })
                      }
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                    >
                      <option value="lifestyle">Lifestyle</option>
                      <option value="personal">Personal</option>
                      <option value="work_study">Work &amp; Study</option>
                      <option value="humor">Humor &amp; Banter</option>
                      <option value="astrology">Astrology</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Night Coding & Chai Preferences"
                    value={formState.title}
                    onChange={(e) =>
                      setFormState({ ...formState, title: e.target.value })
                    }
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. chai, late_night, coding"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Markdown Content
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="- Bullet points of the memory or fact..."
                    value={formState.content}
                    onChange={(e) =>
                      setFormState({ ...formState, content: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 font-mono"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Knowledge Unit'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

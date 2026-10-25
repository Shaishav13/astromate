'use client';

import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { ChatMessage } from '@astromate/shared';
import clsx from 'clsx';

interface ChatBubbleProps {
  message: ChatMessage;
  isUser: boolean;
  mateName?: string;
  mateSymbol?: string;
  userBubbleStyle?: string;
}

export default function ChatBubble({
  message,
  isUser,
  mateName,
  userBubbleStyle,
}: ChatBubbleProps) {
  const timeAgo = formatDistanceToNow(new Date(message.createdAt), {
    addSuffix: true,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={clsx(
        'flex gap-2.5 max-w-[88%] sm:max-w-[82%] md:max-w-[76%] lg:max-w-[72%] mb-2.5 group',
        isUser ? 'self-end flex-row-reverse' : 'self-start flex-row'
      )}
    >
      {/* Mate Avatar Initial */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-slate-800/90 border border-slate-700/60 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-semibold text-slate-300 select-none shadow-sm">
          {mateName ? mateName.charAt(0).toUpperCase() : 'A'}
        </div>
      )}

      {/* Bubble + Metadata Container */}
      <div className={clsx('flex flex-col', isUser ? 'items-end' : 'items-start')}>
        {/* Proactive subtle tag */}
        {message.isProactive && !isUser && (
          <span className="text-[11px] text-amber-300/80 mb-1 flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-950/30 border border-amber-500/20">
            <span>✧</span> Proactive check-in
          </span>
        )}

        {/* Bubble Body */}
        <div
          className={clsx(
            'px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed break-words transition-all shadow-sm',
            isUser
              ? 'text-white rounded-tr-xs shadow-md'
              : 'bg-slate-900/80 backdrop-blur-md text-slate-100 rounded-tl-xs border border-slate-800/80'
          )}
          style={
            isUser
              ? { background: userBubbleStyle || 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)' }
              : undefined
          }
        >
          {message.content}
        </div>

        {/* Timestamp */}
        <span className="text-[11px] text-slate-500 mt-1 px-1 font-normal opacity-70 group-hover:opacity-100 transition-opacity">
          {timeAgo}
        </span>
      </div>
    </motion.div>
  );
}

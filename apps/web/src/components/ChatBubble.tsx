'use client';

import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { ChatMessage } from '@astromate/shared';
import clsx from 'clsx';

interface ChatBubbleProps {
  message: ChatMessage;
  isUser: boolean;
}

export default function ChatBubble({ message, isUser }: ChatBubbleProps) {
  const timeAgo = formatDistanceToNow(new Date(message.createdAt), {
    addSuffix: true,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={clsx(
        'flex flex-col max-w-[78%] mb-1',
        isUser ? 'self-end items-end' : 'self-start items-start'
      )}
    >
      {/* Proactive badge */}
      {message.isProactive && !isUser && (
        <span className="text-xs text-purple-500 mb-1 flex items-center gap-1">
          <span>\u2b50</span> sent you a message
        </span>
      )}

      {/* Bubble */}
      <div
        className={clsx(
          'px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words',
          isUser
            ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-br-sm shadow-md'
            : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'
        )}
      >
        {message.content}
      </div>

      {/* Timestamp */}
      <span className="text-[10px] text-gray-400 mt-1 px-1">{timeAgo}</span>
    </motion.div>
  );
}

'use client';

import { motion } from 'framer-motion';

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      className="self-start flex items-center gap-2 glass-bubble-mate px-4 py-3 rounded-2xl rounded-bl-xs mb-2 border border-purple-500/20 shadow-md"
    >
      <span className="text-[11px] text-purple-300 font-mono tracking-wide flex items-center gap-1.5">
        <span className="animate-pulse">✧</span> channeled thought
      </span>
      <div className="flex items-center gap-1.5 ml-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-cyan-300 shadow-[0_0_6px_rgba(168,85,247,0.8)]"
            animate={{
              y: [0, -4, 0],
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

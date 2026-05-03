import { motion } from "framer-motion";

export function Splash({ onEnter }: { onEnter: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink/95 backdrop-blur-sm cursor-pointer select-none"
      onClick={onEnter}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="text-gold heading-kanji text-7xl mb-8 animate-flicker"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        誅 伏 賜 死
      </motion.div>
      <motion.div
        className="text-parchment/60 font-serif italic text-lg mb-12 tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        Domain &middot; Deadly Sentencing
      </motion.div>
      <motion.button
        className="border border-gold/60 text-gold/90 font-mono px-8 py-3 tracking-widest uppercase hover:bg-gold/10 transition"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        Click to enter the courtroom
      </motion.button>
      <motion.div
        className="text-parchment/30 text-xs mt-8 font-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 0.6 }}
      >
        (audio cannot play until you do)
      </motion.div>
    </motion.div>
  );
}

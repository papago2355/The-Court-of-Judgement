import { motion } from "framer-motion";

export function Round({ number, theme }: { number: number; theme: string }) {
  return (
    <motion.div
      className="mx-auto max-w-4xl px-6 my-8"
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
    >
      <div className="flex items-center gap-4 border-b border-gold/40 pb-3">
        <span className="text-gold heading-kanji text-2xl">⚖</span>
        <span className="font-mono text-gold/80 tracking-widest uppercase text-xs">
          Round {number}
        </span>
        <span className="font-serif italic text-parchment text-2xl">{theme}</span>
      </div>
    </motion.div>
  );
}

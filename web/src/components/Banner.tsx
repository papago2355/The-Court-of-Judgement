import { motion } from "framer-motion";

export function Banner({ matter }: { matter: string }) {
  return (
    <motion.div
      className="relative mx-auto max-w-4xl pt-12 pb-8"
      initial={{ y: -200, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80, damping: 14 }}
    >
      <div className="gilt-frame">
        <div className="inner text-center py-10">
          <div className="flex items-center justify-center gap-6 text-gold heading-kanji text-3xl">
            <span className="opacity-70">⚖</span>
            <span>誅 伏 賜 死</span>
            <span className="opacity-70">⚖</span>
          </div>
          <motion.div
            className="font-serif italic text-parchment/80 mt-3 tracking-[0.3em] uppercase text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Court is now in session
          </motion.div>
          <motion.div
            className="border-t border-gold/30 mt-6 pt-5 text-parchment/60 font-mono text-xs tracking-widest uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            Domain &middot; Deadly Sentencing
          </motion.div>
          <motion.div
            className="font-serif text-parchment text-2xl mt-3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            Matter: <span className="text-goldBright">{matter}</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

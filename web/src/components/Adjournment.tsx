import { motion } from "framer-motion";

export function Adjournment() {
  return (
    <motion.div
      className="mx-auto max-w-4xl px-6 my-10 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="font-mono text-gold/80 tracking-[0.3em] uppercase text-sm border-y border-gold/40 py-4">
        ═══ ⚖ Court is adjourned ⚖ ═══
      </div>
    </motion.div>
  );
}

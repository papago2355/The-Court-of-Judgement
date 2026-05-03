import { motion } from "framer-motion";
import { useEffect } from "react";
import { gavel } from "../lib/sounds";
import type { Ruling } from "../lib/events";

type Props = {
  ruling: Ruling;
  reason: string;
  conditions: string[];
  remand: string | null;
};

const RULING_COLOR: Record<Ruling, string> = {
  APPROVE: "text-emerald-300",
  HOLD: "text-goldBright",
  REJECT: "text-crimsonBright",
  REMAND: "text-sky-300",
};

export function Verdict({ ruling, reason, conditions, remand }: Props) {
  useEffect(() => {
    gavel();
  }, []);

  return (
    <motion.section
      className="mx-auto max-w-4xl px-6 my-12"
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <div className="gilt-frame shadow-gavel">
        <div className="inner py-8 px-8">
          <div className="text-center font-mono text-xs tracking-[0.4em] text-gold/80 uppercase">
            ═══════════ Verdict ═══════════
          </div>

          <motion.div
            className={`text-center ${RULING_COLOR[ruling]} heading-kanji text-6xl mt-6`}
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
          >
            {ruling}
          </motion.div>

          <motion.p
            className="text-parchment/90 font-serif italic text-center mt-6 text-lg max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            {reason}
          </motion.p>

          {conditions.length > 0 && (
            <motion.div
              className="mt-6 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.6 }}
            >
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold/70 mb-3 text-center">
                Conditions of release
              </div>
              <ul className="space-y-2">
                {conditions.map((c, i) => (
                  <li
                    key={i}
                    className="text-parchment/85 font-serif text-base before:content-['—'] before:text-gold before:mr-3"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {remand && (
            <motion.div
              className="mt-6 max-w-2xl mx-auto text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.6 }}
            >
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-sky-300/80 mb-2">
                Sub-question on remand
              </div>
              <p className="text-parchment/90 font-serif italic">{remand}</p>
            </motion.div>
          )}

          <div className="text-center font-mono text-xs tracking-[0.4em] text-gold/80 uppercase mt-8">
            ═══════════════════════════════
          </div>
        </div>
      </div>
    </motion.section>
  );
}

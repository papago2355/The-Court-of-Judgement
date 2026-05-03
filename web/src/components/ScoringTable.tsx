import { motion } from "framer-motion";
import type { ScoringRow } from "../lib/events";
import { useEffect } from "react";
import { bell } from "../lib/sounds";

export function ScoringTable({ rows }: { rows: ScoringRow[] }) {
  useEffect(() => {
    // Ring once on mount; row stamps share the same chime.
    bell();
  }, []);

  return (
    <motion.section
      className="mx-auto max-w-4xl px-6 my-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="parchment p-6 md:p-8">
        <div className="font-mono text-xs tracking-[0.3em] uppercase text-ink/70 mb-4">
          ⚖ Deliberation
        </div>
        <table className="w-full border-collapse font-serif">
          <thead>
            <tr className="text-left border-b border-ink/20">
              <th className="pb-2 pr-4 font-mono text-[10px] uppercase tracking-widest text-ink/60">
                Criterion
              </th>
              <th className="pb-2 pr-4 font-mono text-[10px] uppercase tracking-widest text-ink/60 text-center">
                Result
              </th>
              <th className="pb-2 font-mono text-[10px] uppercase tracking-widest text-ink/60">
                Evidence
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <motion.tr
                key={i}
                className="border-b border-ink/10 align-top"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.35, duration: 0.4 }}
              >
                <td className="py-3 pr-4 text-ink font-medium text-base">
                  {r.criterion}
                </td>
                <td className="py-3 pr-4 text-center">
                  <motion.span
                    className={r.result === "PASS" ? "stamp-pass" : "stamp-fail"}
                    initial={{ scale: 2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6 + i * 0.35, type: "spring", stiffness: 200 }}
                  >
                    {r.result}
                  </motion.span>
                </td>
                <td className="py-3 text-ink/80 text-sm italic">{r.evidence}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}

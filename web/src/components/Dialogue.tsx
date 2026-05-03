import { motion } from "framer-motion";
import type { Speaker } from "../lib/events";

type Props = {
  speaker: Speaker;
  text: string;
  evidence?: string | null;
};

const META: Record<Speaker, { label: string; color: string; align: "left" | "right" | "center" }> = {
  judgeman: { label: "JUDGEMAN", color: "text-gold", align: "center" },
  higuruma: { label: "HIGURUMA", color: "text-crimsonBright", align: "left" },
  defendant: { label: "DEFENDANT", color: "text-parchment", align: "right" },
};

export function Dialogue({ speaker, text, evidence }: Props) {
  const meta = META[speaker];
  const alignClass =
    meta.align === "right" ? "ml-auto" : meta.align === "center" ? "mx-auto" : "mr-auto";
  const justify =
    meta.align === "right" ? "text-right" : meta.align === "center" ? "text-center" : "text-left";

  return (
    <motion.div
      className={`mx-auto max-w-4xl px-6 my-4`}
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className={`max-w-2xl ${alignClass} ${justify}`}>
        <div className={`font-mono text-[10px] tracking-[0.3em] mb-2 ${meta.color}`}>
          {meta.label}
        </div>
        <div className="font-serif text-parchment text-lg leading-relaxed whitespace-pre-wrap">
          {text}
        </div>
        {evidence && (
          <motion.div
            className="sticky-evidence mt-4 max-w-md"
            initial={{ rotate: -8, scale: 0.9, opacity: 0 }}
            animate={{ rotate: -1.2, scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 12 }}
          >
            <div className="text-[9px] tracking-[0.3em] opacity-60 mb-1">EVIDENCE</div>
            &ldquo;{evidence}&rdquo;
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

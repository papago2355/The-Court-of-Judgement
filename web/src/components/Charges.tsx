import { motion } from "framer-motion";

type Props = {
  summary: string;
  scale: string;
  reversibility: string;
  disposition: string;
};

function Chip({ label, value, tone }: { label: string; value: string; tone: "default" | "warn" }) {
  const toneClass =
    tone === "warn"
      ? "border-crimson/60 text-crimson bg-crimson/5"
      : "border-gold/60 text-gold bg-gold/5";
  return (
    <div className={`inline-flex flex-col items-start border ${toneClass} px-3 py-2 rounded-sm font-mono`}>
      <span className="text-[10px] uppercase tracking-widest opacity-70">{label}</span>
      <span className="text-sm font-semibold mt-0.5">{value}</span>
    </div>
  );
}

export function Charges({ summary, scale, reversibility, disposition }: Props) {
  const reversibilityWarn = reversibility.toLowerCase() === "low";
  const scaleWarn = scale.toLowerCase() === "production";
  return (
    <motion.section
      className="mx-auto max-w-4xl px-6 mb-10"
      initial={{ rotateX: -90, opacity: 0, transformOrigin: "top" }}
      animate={{ rotateX: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1], delay: 0.3 }}
    >
      <div className="parchment p-8 md:p-10 relative">
        <div className="absolute -top-3 left-6 bg-ink/90 text-gold px-3 py-1 font-mono text-xs tracking-[0.3em] uppercase">
          ⚖ The Charges
        </div>
        <p className="text-ink font-serif text-xl leading-relaxed">
          The defendant proposes to{" "}
          <span className="font-semibold">{summary}</span>
        </p>
        <div className="flex flex-wrap gap-3 mt-7">
          <Chip label="Scale" value={scale} tone={scaleWarn ? "warn" : "default"} />
          <Chip label="Reversibility" value={reversibility} tone={reversibilityWarn ? "warn" : "default"} />
          <Chip label="Disposition" value={disposition} tone="default" />
        </div>
      </div>
    </motion.section>
  );
}

import { motion } from "framer-motion";

export function WaitingRoom({ status }: { status: "connecting" | "open" | "closed" | "idle" }) {
  const statusText = {
    idle: "preparing",
    connecting: "connecting to court clerk",
    open: "courtroom is empty — awaiting the next case",
    closed: "connection lost — retrying",
  }[status];

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="text-center">
        <div className="text-gold heading-kanji text-5xl opacity-40 animate-flicker">
          誅 伏 賜 死
        </div>
        <div className="font-mono text-parchment/40 text-xs tracking-widest uppercase mt-6">
          {statusText}
        </div>
      </div>
    </motion.div>
  );
}

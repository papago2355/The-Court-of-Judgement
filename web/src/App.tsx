import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTrialEvents } from "./lib/useTrialEvents";
import { unlockAudio } from "./lib/sounds";
import { Splash } from "./components/Splash";
import { Banner } from "./components/Banner";
import { Charges } from "./components/Charges";
import { Round } from "./components/Round";
import { Dialogue } from "./components/Dialogue";
import { ScoringTable } from "./components/ScoringTable";
import { Verdict } from "./components/Verdict";
import { Adjournment } from "./components/Adjournment";
import { WaitingRoom } from "./components/WaitingRoom";
import type { TrialEvent } from "./lib/events";

export default function App() {
  const [entered, setEntered] = useState(false);
  const { events, status } = useTrialEvents();
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Set the kanji title in case the index.html title was overridden.
    document.title = "誅伏賜死";
  }, []);

  useEffect(() => {
    if (events.length === 0) return;
    const id = window.setTimeout(() => {
      endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 80);
    return () => window.clearTimeout(id);
  }, [events.length]);

  const haveTrial = events.some((e) => e.type === "convene");

  return (
    <div className="min-h-screen">
      <AnimatePresence>
        {!entered && (
          <Splash
            onEnter={() => {
              unlockAudio();
              setEntered(true);
            }}
          />
        )}
      </AnimatePresence>

      {!haveTrial && entered && <WaitingRoom status={status} />}

      {haveTrial && (
        <main className="pb-32">
          {events.map((ev, i) => (
            <EventNode key={i} ev={ev} />
          ))}
          <div ref={endRef} />
        </main>
      )}
    </div>
  );
}

function EventNode({ ev }: { ev: TrialEvent }) {
  switch (ev.type) {
    case "convene":
      return <Banner matter={ev.matter} />;
    case "charges":
      return (
        <Charges
          summary={ev.summary}
          scale={ev.scale}
          reversibility={ev.reversibility}
          disposition={ev.disposition}
        />
      );
    case "round":
      return <Round number={ev.number} theme={ev.theme} />;
    case "speech":
      return (
        <Dialogue speaker={ev.speaker} text={ev.text} evidence={ev.evidence} />
      );
    case "deliberate":
      return <ScoringTable rows={ev.rows} />;
    case "verdict":
      return (
        <Verdict
          ruling={ev.ruling}
          reason={ev.reason}
          conditions={ev.conditions}
          remand={ev.remand}
        />
      );
    case "adjourn":
      return <Adjournment />;
    default:
      return null;
  }
}

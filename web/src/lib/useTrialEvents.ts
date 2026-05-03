import { useEffect, useRef, useState } from "react";
import type { TrialEvent } from "./events";

type Status = "idle" | "connecting" | "open" | "closed";

// In dev, Vite proxies /ws to the Python server.
// In production (served by the Python server), same-origin WS.
function wsUrl(): string {
  const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${proto}//${window.location.host}/ws`;
}

export function useTrialEvents() {
  const [events, setEvents] = useState<TrialEvent[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let cancelled = false;
    let retryDelay = 500;

    function connect() {
      if (cancelled) return;
      setStatus("connecting");
      const ws = new WebSocket(wsUrl());
      wsRef.current = ws;

      ws.onopen = () => {
        retryDelay = 500;
        setStatus("open");
      };
      ws.onmessage = (e) => {
        try {
          const ev = JSON.parse(e.data) as TrialEvent;
          setEvents((prev) => [...prev, ev]);
        } catch {
          // ignore malformed
        }
      };
      ws.onclose = () => {
        setStatus("closed");
        if (!cancelled) {
          setTimeout(connect, retryDelay);
          retryDelay = Math.min(retryDelay * 2, 5000);
        }
      };
      ws.onerror = () => ws.close();
    }

    connect();
    return () => {
      cancelled = true;
      wsRef.current?.close();
    };
  }, []);

  return { events, status };
}

"""
Judgement MCP server.

Two faces, one process:
  - stdio MCP transport on the main thread (Claude Code talks to it here)
  - FastAPI + uvicorn on a daemon thread serving the courtroom UI at
    http://localhost:9876 and a WebSocket at /ws

MCP tools push events onto a thread-safe bus. WebSocket clients receive the
full event history on connect (so refreshing the tab replays the trial),
plus all subsequent events live.
"""

from __future__ import annotations

import asyncio
import threading
import webbrowser
from collections import deque
from pathlib import Path
from typing import Any

import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from mcp.server.fastmcp import FastMCP

PORT = 9876
WEB_DIR = Path(__file__).parent / "web"


# ---------------------------------------------------------------------------
# Event bus — bridges the synchronous MCP tool thread and the async web loop.
# ---------------------------------------------------------------------------


class TrialBus:
    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._history: list[dict[str, Any]] = []
        self._clients: set[asyncio.Queue[dict[str, Any]]] = set()
        self._loop: asyncio.AbstractEventLoop | None = None

    def attach_loop(self, loop: asyncio.AbstractEventLoop) -> None:
        self._loop = loop

    def reset(self) -> None:
        with self._lock:
            self._history.clear()

    def broadcast(self, event: dict[str, Any]) -> None:
        with self._lock:
            self._history.append(event)
            queues = list(self._clients)
            loop = self._loop
        if loop is None:
            return
        for q in queues:
            loop.call_soon_threadsafe(q.put_nowait, event)

    async def subscribe(self) -> tuple[asyncio.Queue[dict[str, Any]], list[dict[str, Any]]]:
        q: asyncio.Queue[dict[str, Any]] = asyncio.Queue()
        with self._lock:
            history = list(self._history)
            self._clients.add(q)
        return q, history

    def unsubscribe(self, q: asyncio.Queue[dict[str, Any]]) -> None:
        with self._lock:
            self._clients.discard(q)


bus = TrialBus()


# ---------------------------------------------------------------------------
# FastAPI app — serves the SPA and the WebSocket.
# ---------------------------------------------------------------------------


app = FastAPI(title="Judgement")


@app.websocket("/ws")
async def ws_endpoint(websocket: WebSocket) -> None:
    await websocket.accept()
    q, history = await bus.subscribe()
    try:
        for ev in history:
            await websocket.send_json(ev)
        while True:
            ev = await q.get()
            await websocket.send_json(ev)
    except WebSocketDisconnect:
        pass
    finally:
        bus.unsubscribe(q)


@app.get("/health")
def health() -> JSONResponse:
    return JSONResponse({"ok": True, "port": PORT})


def _mount_web() -> None:
    if not WEB_DIR.exists():
        @app.get("/")
        def missing() -> JSONResponse:
            return JSONResponse(
                {
                    "error": "web bundle missing",
                    "hint": "build the frontend (cd web && npm run build) "
                    "and copy dist/ into judgement_mcp/web/",
                },
                status_code=503,
            )
        return

    assets = WEB_DIR / "assets"
    if assets.exists():
        app.mount("/assets", StaticFiles(directory=str(assets)), name="assets")

    sounds = WEB_DIR / "sounds"
    if sounds.exists():
        app.mount("/sounds", StaticFiles(directory=str(sounds)), name="sounds")

    index = WEB_DIR / "index.html"

    @app.get("/{full_path:path}")
    def spa(full_path: str) -> FileResponse:
        target = WEB_DIR / full_path
        if full_path and target.is_file():
            return FileResponse(target)
        return FileResponse(index)


_mount_web()


# ---------------------------------------------------------------------------
# Web thread — runs uvicorn on its own asyncio loop.
# ---------------------------------------------------------------------------


_web_started = False
_web_lock = threading.Lock()


def _run_web() -> None:
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    bus.attach_loop(loop)
    config = uvicorn.Config(
        app,
        host="127.0.0.1",
        port=PORT,
        log_level="warning",
        loop="asyncio",
        access_log=False,
    )
    server = uvicorn.Server(config)
    loop.run_until_complete(server.serve())


def ensure_web_running() -> None:
    global _web_started
    with _web_lock:
        if _web_started:
            return
        threading.Thread(target=_run_web, daemon=True, name="judgement-web").start()
        _web_started = True


# ---------------------------------------------------------------------------
# MCP tools.
# ---------------------------------------------------------------------------


mcp = FastMCP("judgement")
_browser_opened = False


@mcp.tool()
def convene(matter: str) -> str:
    """
    Open the Court of Judgement UI in the user's browser and announce the
    matter on the docket. Always the first tool to call when starting a trial.

    Args:
        matter: A short tag (≤ 40 chars) for this case, shown on the banner.
                Examples: "Static-Site Personal Blog", "LLM Chatbot @ 100 Users".
    """
    global _browser_opened
    ensure_web_running()
    bus.reset()
    bus.broadcast({"type": "convene", "matter": matter})
    if not _browser_opened:
        try:
            webbrowser.open(f"http://localhost:{PORT}")
        except Exception:
            pass
        _browser_opened = True
    return (
        f"Court convened. UI: http://localhost:{PORT}  "
        "(if a browser tab did not open, open this URL manually). "
        "Note: the first interaction with the page is needed to unlock audio — "
        "tell the defendant to click the splash to enter the courtroom."
    )


@mcp.tool()
def read_charges(
    summary: str,
    scale: str,
    reversibility: str,
    disposition: str,
) -> str:
    """
    Display the charges on the parchment panel.

    Args:
        summary: One sentence describing what the defendant proposes.
        scale: 'personal' | 'small' | 'production'.
        reversibility: 'high' | 'low'.
        disposition: One phrase, e.g. "standard cross-examination".
    """
    bus.broadcast(
        {
            "type": "charges",
            "summary": summary,
            "scale": scale,
            "reversibility": reversibility,
            "disposition": disposition,
        }
    )
    return "Charges displayed."


@mcp.tool()
def begin_round(number: int, theme: str) -> str:
    """
    Open a round of cross-examination.

    Args:
        number: Round number, 1-indexed.
        theme: 'Stack & Substrate' | 'Scope & Scale' | 'Failure & Risk'.
    """
    bus.broadcast({"type": "round", "number": number, "theme": theme})
    return f"Round {number} ({theme}) opened."


@mcp.tool()
def speak(speaker: str, text: str, evidence_quote: str | None = None) -> str:
    """
    Render dialogue from one of the three speakers.

    Args:
        speaker: 'higuruma' | 'judgeman' | 'defendant'.
        text: The line of dialogue.
        evidence_quote: Optional quoted defendant testimony pinned as evidence
            (only meaningful when speaker is 'higuruma').
    """
    if speaker not in {"higuruma", "judgeman", "defendant"}:
        return f"error: unknown speaker {speaker!r}"
    bus.broadcast(
        {
            "type": "speech",
            "speaker": speaker,
            "text": text,
            "evidence": evidence_quote,
        }
    )
    return f"{speaker} spoke."


@mcp.tool()
def deliberate(rows: list[dict[str, str]]) -> str:
    """
    Render the deliberation scoring table.

    Args:
        rows: A list of dicts with keys:
              - criterion: short label
              - result:    'PASS' or 'FAIL'
              - evidence:  one-line citation from the testimony
    """
    cleaned: list[dict[str, str]] = []
    for r in rows:
        cleaned.append(
            {
                "criterion": str(r.get("criterion", "")),
                "result": str(r.get("result", "")).upper(),
                "evidence": str(r.get("evidence", "")),
            }
        )
    bus.broadcast({"type": "deliberate", "rows": cleaned})
    return f"Deliberation rendered ({len(cleaned)} rows)."


@mcp.tool()
def pronounce_verdict(
    ruling: str,
    reason: str,
    conditions: list[str] | None = None,
    remand: str | None = None,
) -> str:
    """
    Pronounce the verdict — gavel hits, verdict frame zooms in.

    Args:
        ruling: 'APPROVE' | 'HOLD' | 'REJECT' | 'REMAND'.
        reason: One or two sentences citing specific testimony.
        conditions: Bullets of evidence required for retrial (HOLD only).
        remand: The smaller sub-question to try first (REMAND only).
    """
    ruling_u = ruling.upper().strip()
    if ruling_u not in {"APPROVE", "HOLD", "REJECT", "REMAND"}:
        return f"error: unknown ruling {ruling!r}"
    bus.broadcast(
        {
            "type": "verdict",
            "ruling": ruling_u,
            "reason": reason,
            "conditions": list(conditions or []),
            "remand": remand,
        }
    )
    return f"Verdict pronounced: {ruling_u}."


@mcp.tool()
def adjourn() -> str:
    """Close the trial — curtain wipe, adjournment band."""
    bus.broadcast({"type": "adjourn"})
    return "Court adjourned."


# ---------------------------------------------------------------------------
# Entry point.
# ---------------------------------------------------------------------------


def main() -> None:
    ensure_web_running()
    mcp.run()


if __name__ == "__main__":
    main()

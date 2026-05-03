"""
Capture cinematic-UI screenshots for the README.

Spins up the Python MCP server's web thread, drives a full sample trial
through the FastMCP tool functions, and uses Playwright (chromium) to take
PNGs of the courtroom at each milestone.

Outputs land in docs/screenshots/.

Usage:
    python -m pip install playwright
    python -m playwright install chromium
    python scripts/capture_screenshots.py
"""

from __future__ import annotations

import sys
import time
from pathlib import Path

# Make the in-tree mcp-server package importable without an install.
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "mcp-server"))

from judgement_mcp import server  # noqa: E402

OUT_DIR = ROOT / "docs" / "screenshots"
OUT_DIR.mkdir(parents=True, exist_ok=True)

PORT = server.PORT
URL = f"http://localhost:{PORT}"

VIEWPORT = {"width": 1280, "height": 800}


def fn(tool_name: str):
    return server.mcp._tool_manager._tools[tool_name].fn  # type: ignore[attr-defined]


def main() -> None:
    from playwright.sync_api import sync_playwright

    server.ensure_web_running()
    time.sleep(1.0)

    convene = fn("convene")
    read_charges = fn("read_charges")
    begin_round = fn("begin_round")
    speak = fn("speak")
    deliberate = fn("deliberate")
    pronounce_verdict = fn("pronounce_verdict")
    adjourn = fn("adjourn")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport=VIEWPORT, device_scale_factor=2)
        page = context.new_page()

        # 1) Splash screen.
        page.goto(URL, wait_until="networkidle")
        page.wait_for_timeout(700)
        page.screenshot(path=str(OUT_DIR / "01-splash.png"), full_page=False)
        print("→ 01-splash.png")

        # Click into the courtroom to dismiss the splash.
        page.locator("button", has_text="Click to enter the courtroom").click()
        page.wait_for_timeout(800)

        # 2) Banner — court is now in session.
        convene("Static-Site Personal Blog")
        page.wait_for_timeout(2200)
        page.screenshot(path=str(OUT_DIR / "02-banner.png"), full_page=False)
        print("→ 02-banner.png")

        # 3) Charges parchment unfurl.
        read_charges(
            summary=(
                "build a personal Markdown blog on Next.js, deploy it to Vercel, "
                "and defer comments, analytics, image strategy, SEO, and the "
                "MDX-vs-Markdown decision until later."
            ),
            scale="personal",
            reversibility="high",
            disposition="standard cross-examination",
        )
        page.wait_for_timeout(1800)
        page.screenshot(path=str(OUT_DIR / "03-charges.png"), full_page=True)
        print("→ 03-charges.png")

        # 4) Cross-examination — round + Higuruma quoted-evidence + defendant.
        begin_round(1, "Stack & Substrate")
        page.wait_for_timeout(800)
        speak(
            speaker="higuruma",
            text=(
                "Defendant. You wrote — \"Probably Next.js because it's popular.\"\n\n"
                "Probably. Popular. I will ask the question your plan refused.\n"
                "Why Next.js for *this*. What do you get from a React app framework "
                "that a static-site generator does not, that you actually need."
            ),
            evidence_quote="Probably Next.js because it's popular and good at this.",
        )
        page.wait_for_timeout(1200)
        speak(
            speaker="defendant",
            text="I don't know about that. I just make this by claude code.",
        )
        page.wait_for_timeout(900)
        # Scroll to bring the dialogue into view.
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        page.wait_for_timeout(400)
        page.screenshot(path=str(OUT_DIR / "04-cross-examination.png"), full_page=True)
        print("→ 04-cross-examination.png")

        # 5) Deliberation — scoring stamps fill in row by row.
        deliberate(
            rows=[
                {"criterion": "Stack chosen with stated reason", "result": "FAIL", "evidence": "\"Probably Next.js because it's popular.\""},
                {"criterion": "Scale claim is a number", "result": "PASS", "evidence": "\"a handful of readers — friends, mostly.\""},
                {"criterion": "At least one out-of-scope item", "result": "PASS", "evidence": "Comments, analytics, SEO — explicitly deferred."},
                {"criterion": "First failure mode identified", "result": "FAIL", "evidence": "\"Probably none.\""},
                {"criterion": "Acknowledges what they don't know", "result": "PASS", "evidence": "\"I don't know\" — uttered honestly."},
            ],
        )
        page.wait_for_timeout(2700)
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        page.wait_for_timeout(400)
        page.screenshot(path=str(OUT_DIR / "05-deliberation.png"), full_page=True)
        print("→ 05-deliberation.png")

        # 6) Verdict reveal.
        pronounce_verdict(
            ruling="HOLD",
            reason=(
                "The defendant's strategy is agent-driven construction, which is "
                "permissible for a personal toy — but the defendant cannot describe "
                "the deploy pipeline they named, nor a review checklist for the "
                "agent's output."
            ),
            conditions=[
                "Deploy a single hello-world page to Vercel BEFORE asking the agent for the full blog.",
                "State, in three steps, what happens between `git push` and the post being live.",
                "Write down three things you will check on the finished site to decide whether to publish.",
            ],
        )
        page.wait_for_timeout(2200)
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        page.wait_for_timeout(400)
        page.screenshot(path=str(OUT_DIR / "06-verdict.png"), full_page=True)
        print("→ 06-verdict.png")

        # 7) Adjournment.
        adjourn()
        page.wait_for_timeout(1000)
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        page.wait_for_timeout(300)
        page.screenshot(path=str(OUT_DIR / "07-adjournment.png"), full_page=True)
        print("→ 07-adjournment.png")

        browser.close()

    print(f"\n✓ saved to {OUT_DIR}")


if __name__ == "__main__":
    main()

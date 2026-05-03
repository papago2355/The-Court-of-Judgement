"""
Smoke test for the Judgement web UI.

Imports the server module, starts the web thread directly, then invokes the
underlying functions wrapped by the MCP tools (NOT through MCP/stdio — this
script is a pure UI driver). After it runs, open http://localhost:9876 in a
browser to watch a fully-staged trial unfold from the in-memory event history.

Usage:
    python smoke_test.py
"""

from __future__ import annotations

import time

from judgement_mcp import server

# The @mcp.tool() decorator wraps each function; the original callable is
# preserved on the FunctionTool object as `.fn`. Reach in to drive them
# without going through stdio.
def _fn(tool_name: str):
    tool = server.mcp._tool_manager._tools[tool_name]
    return tool.fn  # type: ignore[attr-defined]


def main() -> None:
    convene = _fn("convene")
    read_charges = _fn("read_charges")
    begin_round = _fn("begin_round")
    speak = _fn("speak")
    deliberate = _fn("deliberate")
    pronounce_verdict = _fn("pronounce_verdict")
    adjourn = _fn("adjourn")

    print(convene("Static-Site Personal Blog"))
    print("→ Open http://localhost:9876, click into the courtroom,")
    print("  then this script will play the trial in 4 seconds.")
    time.sleep(4)

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
    time.sleep(3)

    begin_round(1, "Stack & Substrate")
    time.sleep(1.5)
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
    time.sleep(2.5)
    speak(speaker="defendant", text="I don't know about that. I just make this by claude code.")
    time.sleep(2)

    begin_round(2, "Scope & Failure")
    time.sleep(1.2)
    speak(
        speaker="higuruma",
        text=(
            "How will you know the blog is good enough to publish?\n"
            "Walk the court through your deploy pipeline, in order, in your own words.\n"
            "What is the cheapest version of this blog that proves the pipeline works?"
        ),
    )
    time.sleep(2.5)
    speak(speaker="defendant", text="Uhm.. by some kind of console panel I guess. Cloudflare? My space?")
    time.sleep(2)

    speak(speaker="judgeman", text="The court will deliberate.")
    time.sleep(1.2)

    deliberate(
        rows=[
            {"criterion": "Stack chosen with stated reason", "result": "FAIL", "evidence": "\"Probably Next.js because it's popular.\""},
            {"criterion": "Scale claim is a number", "result": "PASS", "evidence": "\"a handful of readers — friends, mostly.\""},
            {"criterion": "At least one out-of-scope item", "result": "PASS", "evidence": "Comments, analytics, SEO — explicitly deferred."},
            {"criterion": "First failure mode identified", "result": "FAIL", "evidence": "\"Probably none.\""},
            {"criterion": "Acknowledges what they don't know", "result": "PASS", "evidence": "\"I don't know\" — uttered honestly, repeatedly."},
        ],
    )
    time.sleep(5)

    pronounce_verdict(
        ruling="HOLD",
        reason=(
            "The defendant's strategy is agent-driven construction, which is "
            "permissible for a personal toy — but the defendant cannot describe "
            "the deploy pipeline they named, nor a review checklist for the "
            "agent's output. Without these, \"Claude Code will build it\" "
            "becomes \"Claude Code will build something, and I will not know if "
            "it is wrong.\""
        ),
        conditions=[
            "Deploy a single hello-world page to Vercel BEFORE asking the agent for the full blog.",
            "State, in three steps, what happens between `git push` and the post being live.",
            "Write down three things you will check on the finished site to decide whether to publish it.",
        ],
    )
    time.sleep(6)
    adjourn()
    print("\nTrial complete. Refresh the browser to replay from history.")
    print("Press Ctrl+C to stop the server.\n")
    while True:
        time.sleep(1)


if __name__ == "__main__":
    main()

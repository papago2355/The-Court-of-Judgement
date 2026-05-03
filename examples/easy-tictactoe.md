# Plan: Tic-Tac-Toe in the Browser

## What I want to build
A tic-tac-toe game that runs in a single HTML file. Two human players take turns clicking cells. The game detects wins and draws and shows a banner. A "Reset" button starts a new round.

## Stack
- Plain HTML, CSS, and vanilla JavaScript. No framework.
- Single `index.html`, no build step. Open the file in a browser to play.

## Scope
- One game at a time, two players sharing one keyboard/mouse.
- Local only — no server, no networking, no scores persisted between page reloads.
- No AI opponent. No timer. No theming options.

## Out of scope (intentional)
- Online multiplayer.
- Win/loss history.
- Mobile-optimized layout (it should *work* on mobile, but I'm not designing for it).

## Failure modes I expect
- Click handler attached twice → double-fires. I'll register the listener once, in a single `init()` call.
- Win-detection edge case on draws → I'll check the draw condition only after the win condition, and only when all 9 cells are filled.

## What I don't know
- Whether to use CSS grid or flexbox for the 3×3 board. I'll start with grid because it maps directly to the data model.

## Success criteria
- I can play a full game start to finish in the browser.
- The first move alternates between X and O across resets.

This is a weekend toy. No deployment, no users besides me.

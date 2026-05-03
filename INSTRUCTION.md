Recently, I was quite impressed by a technique called “Judgement” (주복사사) in the anime Jujutsu Kaisen.
It’s a technique inspired by a modern legal trial system.

There are three trial stages, each with one chance to argue. Depending on the outcome, the penalties are:

* Confiscation (temporarily taking away abilities or functions)
* Acquittal
* Judgment (in the anime, this can grant a sword capable of killing)

From this, I came up with the idea of **“LLM as a judge” using a code plugin**.

---

### Core Idea

* When a user proposes a new idea or concept → is it truly valid?
* Instead of the LLM persuading the user → the **user must persuade the LLM**
* If the argument is sound → proceed
* If not → hold or reject

This idea starts from the following principle:

> “If you, the user, cannot properly testify (i.e., explain) your own idea, concept, or implementation, then it is not a good process.”

---

### Motivation

During AI-assisted coding, if you vaguely understand something and just ask to “build it,” the LLM or coding agent will interpret it arbitrarily.

So:

* If the user can argue convincingly with a reasonable level of explanation →
  even if issues or limitations arise later, they will have the insight to fix them themselves.

---

### Key Questions & Considerations

#### 1) How do we define “reasonable explanation”?

* LLMs can outline ideas through planning and specs.
* Users should at least specify:

  * Tech stack / framework
  * OS
  * Data format
  * Serving method
  * Backend / frontend

Example:

* If a user says:
  “I want to build a chat platform serving 100 users with an LLM”
  → They should be able to answer:

  * Will it run on physical GPUs or cloud?
  * Which framework?
  * Which model?
  * Memory requirements?
  * Server resource management?

* On the other hand:

  * A simple “tic-tac-toe game” doesn’t need that level of detail
    → It can just be done with JS + HTML.

---

#### 2) What becomes the subject of judgment?

* Existing plan files (e.g., `.md` documents)
* New idea documents or even raw chat input

---

#### 3) What is the outcome of the trial?

* Unlike the anime, we can’t delete or confiscate files
* Instead, for `.md` files:

  * Add at the top:

    * Date
    * Verdict: (Hold / Reject / Approve)
    * Reason: (Why this decision was made)

This helps future agent sessions:

* Highlight risks
* Encourage caution

---

#### 4) What if the issue gets resolved later? Won’t it confuse the agent?

* Explicit text is not binding code—it’s just reference

* If a few lines of judgment confuse the agent:
  → the context is already too messy, and the session itself is flawed

* Modern systems like Codex or Claude already manage this well with memory

* Memory issues can still happen:
  → the user should point them out

* If the user cannot even do that:
  → it means they are not ready to implement that idea

---

#### 5) What if the user just reads the `.md` file and answers?

* That’s actually the goal.

The purpose is:

* To make the user re-read their plan and AI design at least once
* To ensure they understand:
  **“What exactly am I building right now?”**

---

### Final Goal

This “skill” is designed to ensure that when coding with AI:

* The user actively reviews their plans
* Gains clarity about their system
* Builds real understanding instead of relying blindly on the AI


---

### Design details
Here are some design concepts I want you to check 'whether we can do this'
A) Can we set cli view to feel like 'actual trial like' style?
B) Can we set character/animation to feel like 'actual trial like' in Jujutsu Kaisen? (Not 100% but the style) I also noticed Claude Code has companion plugin
C) Can we set skill to check memory/context/history when it is needed?
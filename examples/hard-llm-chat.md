# Plan: LLM Chat Platform for ~100 Users

## What I want to build
A web-based chat platform where users can talk to an LLM. Like ChatGPT but ours. Around 100 users at the company will use it daily.

## Stack
- Probably React on the frontend, something modern.
- Some backend — Python or Node, whichever the AI handles better.
- An open-source LLM so we don't pay per token. Llama or Mistral or similar.
- We have a server somewhere with a GPU. I think it's an A100 but I'd have to check.

## Scope
- Login (we'll figure out auth, maybe Google SSO).
- Chat history per user.
- Streaming responses.
- Eventually: file upload, RAG over our internal docs, maybe agents.

## How it'll work
The user sends a message, the backend forwards it to the model, the model streams back a response. Chat history is saved so users can come back. AI will handle most of the wiring — there are tutorials for this.

## Resources
- One GPU server (I think A100, could be a 3090, I'll check).
- The team has 3 people. None of us have shipped an LLM product before but we've all used ChatGPT a lot.
- Budget: not really defined. "Reasonable."

## Timeline
- Want a working version in 2 weeks.
- Production rollout to all 100 users in 6 weeks.

## What could go wrong
- Performance, maybe? If everyone uses it at once.
- The model might say something weird. We'll add a filter.

## Success criteria
- 100 users can use it daily without it falling over.
- Responses feel as good as ChatGPT.

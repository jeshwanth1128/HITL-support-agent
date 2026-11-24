# HITL Support Agent
Deploy: push to GitHub, import in Vercel. Env vars: ADMIN_TOKEN (16+ random chars, required), LLM_BASE_URL (your Modal endpoint URL + /v1), LLM_API_KEY (wk-<id>.ws-<secret>), LLM_MODEL (e.g. Qwen/Qwen3.8-2.4T-A95B) — all optional; or ANTHROPIC_API_KEY, UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN (recommended; without it state lives in per-instance memory).
Demo orders: ORD-1001/alex@example.com ($49.99), ORD-1002/sam@example.com (45 days, auto-denied), ORD-1003/alex@example.com ($219).
Run `npm test` locally.

Knowledge Base: unlock the Reviewer Console, open the Knowledge Base window, upload .txt/.md/.csv (max 50 KB each, 20 files). Uploaded text is chunked and used for answers with a Source line. Requires Upstash to persist.

## Architecture
Customer message -> tool-calling LLM agent (search_docs, lookup_order, propose_refund) -> propose_refund starts a LangGraph workflow: verify -> approval (interrupt) -> execute. The graph pauses, its checkpoint is saved to Upstash, and the reviewer's decision resumes the same thread with Command({resume}). The LLM has no way to issue money; eligibility and amounts come from deterministic server code. If LangGraph or the LLM is unavailable the app degrades to a native engine / rules mode and /api/health plus the Agent Trace window show which one is active.
Run `npm install && npm test` locally to verify the real LangGraph path (test fails if it silently falls back).

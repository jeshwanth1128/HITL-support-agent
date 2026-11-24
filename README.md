# HITL Support Agent
Deploy: push to GitHub, import in Vercel. Env vars: ADMIN_TOKEN (16+ random chars, required), LLM_BASE_URL (your Modal endpoint URL + /v1), LLM_API_KEY (wk-<id>.ws-<secret>), LLM_MODEL (e.g. Qwen/Qwen3.8-2.4T-A95B) — all optional; or ANTHROPIC_API_KEY, UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN (recommended; without it state lives in per-instance memory).
Demo orders: ORD-1001/alex@example.com ($49.99), ORD-1002/sam@example.com (45 days, auto-denied), ORD-1003/alex@example.com ($219).
Run `npm test` locally.

Knowledge Base: unlock the Reviewer Console, open the Knowledge Base window, upload .txt/.md/.csv (max 50 KB each, 20 files). Uploaded text is chunked and used for answers with a Source line. Requires Upstash to persist.

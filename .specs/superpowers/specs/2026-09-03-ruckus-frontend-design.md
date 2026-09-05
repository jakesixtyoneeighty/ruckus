# Ruckus Frontend Studio Design Specification

**Date:** 2026-09-03  
**Status:** Approved  
**Author:** Pair Programming Agent & Jacob Ambroz  
**Target:** Monolithic Next.js 15+ App Router integrated with Eve Framework, Supabase Auth & Database, and a Cyber-Luxe Floating Glass Canvas Studio.

---

## 1. Executive Summary & Vision

Ruckus is an autonomous, full-stack multi-agent application builder powered by Vercel's Eve agent framework. Its existing engine orchestrates 7 specialist subagents (`intent`, `orchestrator`, `design_research` with Refero MCP, `ask_question` HITL checkpoint, `generate_next_app_from_spec` / `code_writer`, `autofix`, `start_preview`, `run_security_review`, and `deploy_to_vercel`).

This design specification adds a world-class, high-polish web frontend studio (inspired by Lovable, v0, and Bolt) to transform Ruckus from a CLI/TUI-operated builder into an intuitive, consumer-grade visual app studio.

---

## 2. Architecture & Monolith Integration

### 2.1 Unified App Router with `withEve`
The frontend and Eve agent runtime coexist as a unified project in the repository root using Eve's official `withEve(nextConfig)` wrapper from `eve/next`:
- **Single Runtime:** `pnpm dev` boots both the Next.js frontend dev server and the Eve agent runtime seamlessly.
- **Zero-CORS Route Mounting:** Session endpoints (`/eve/v1/session*`, `/eve/v1/health`, `/eve/v1/info`) mount on the same origin as the web application.
- **Deployment Parity:** Deploys as a unified Vercel project without secondary server origins or complex environment routing.

### 2.2 Preserving Repository Constraints
- `scripts/smoke.mjs` guarantees remain strictly enforced:
  - All declared agent files in `agent/` and subagents remain intact.
  - `package.json` retains its required `dev` script flags (`--no-ui`, `--subagents hidden`, `--tools collapsed`).
  - No `docs/` directory is created in the repository root (specifications reside in `.specs/`).

---

## 3. Database & Authentication Architecture (Supabase)

### 3.1 Supabase Database Schema
PostgreSQL tables managed via Supabase with Row-Level Security (RLS):

1. **`profiles`**
   - `id` (UUID, primary key, references `auth.users(id)` on delete cascade)
   - `email` (TEXT, not null)
   - `full_name` (TEXT)
   - `avatar_url` (TEXT)
   - `created_at` (TIMESTAMPTZ, default `now()`)

2. **`projects`**
   - `id` (UUID, primary key, default `gen_random_uuid()`)
   - `user_id` (UUID, references `profiles(id)` on delete cascade)
   - `title` (TEXT, not null)
   - `prompt` (TEXT, initial user prompt)
   - `status` (TEXT: `"draft" | "building" | "ready" | "failed"`)
   - `vercel_deployment_url` (TEXT, nullable)
   - `preview_port` (INTEGER, default 4173)
   - `created_at` / `updated_at` (TIMESTAMPTZ, default `now()`)

3. **`sessions`**
   - `id` (UUID, primary key, default `gen_random_uuid()`)
   - `project_id` (UUID, references `projects(id)` on delete cascade)
   - `eve_session_id` (TEXT, stable Eve session ID)
   - `continuation_token` (TEXT)
   - `stream_index` (INTEGER, default 0)
   - `events_snapshot` (JSONB, cached NDJSON events for instant resumption)
   - `updated_at` (TIMESTAMPTZ, default `now()`)

4. **`project_files`** (file explorer cache)
   - `id` (UUID, primary key, default `gen_random_uuid()`)
   - `project_id` (UUID, references `projects(id)` on delete cascade)
   - `path` (TEXT, not null)
   - `content` (TEXT, not null)
   - `updated_at` (TIMESTAMPTZ, default `now()`)

### 3.2 Inbound Route Authentication Walk (`agent/channels/eve.ts`)
Eve's route authentication is updated with an ordered walk:
1. **Supabase JWT Verifier (`supabaseAuth`):** Validates Bearer tokens or cookies from logged-in web users and maps them to Eve's `SessionAuthContext`.
2. **Vercel OIDC (`vercelOidc`):** Admits Vercel infrastructure and inter-deployment callers.
3. **Local Dev (`localDev`):** Transparent fallback during local CLI/TUI testing.

---

## 4. UI/UX & Studio Canvas Experience

### 4.1 Layout Archetype: The Floating Glass Canvas
A preview-first, immersive studio where the generated application occupies the center stage, flanked by an intelligent HUD and floating controls:
- **Top HUD Subagent Pipeline:** Animated horizontal badge strip across the top displaying real-time agent progression (`Intent` $\to$ `Orchestrator` $\to$ `Design Research` $\to$ `Approval` $\to$ `Code Generator` $\to$ `Autofix` $\to$ `Preview & Security`). Active subagents pulse with liquid light and stream thought tokens.
- **Center Canvas Viewport:** Iframe rendering the live Next.js sandbox application with device bezel simulator controls (Desktop 1440px / 100%, Tablet 768px, Mobile 375px), live health indicator (`● Preview Healthy :4173`), and responsive zoom/rotate.
- **Interactive HITL Approval Modal:** When Eve triggers `ask_question` at the design gate, an amber-gold glass card slides into the canvas presenting the 12-bullet plan, palette swatches, and action buttons (`Approve & Build`, `Revise`, `Stop`) wired to `send({ inputResponses: ... })`.
- **Bottom Floating Command Dock:** Frosted liquid-glass bar (`backdrop-filter: blur(28px)`) with prompt input for follow-ups and quick action pills to toggle slide-out drawers.
- **Slide-out Inspection Drawers:**
  - **File Explorer & Diff Viewer:** Monaco-powered syntax-highlighted code tree and git diffs for generated files.
  - **Terminal & Quality Console:** Real-time stdout/stderr from sandbox builds, typechecks, and health probes.
  - **Security Audit Drawer:** Detailed audit results from `run_security_review`.

### 4.2 Initial Prompt & Morph Transition
- **Landing State (`/`):** Cinematic aurora mesh background with a centered hero prompt card, Unsplash/wireframe upload triggers, and prompt suggestion pills.
- **Liquid Spring Morph:** On clicking "Build with Eve", Framer Motion spring physics animate the hero prompt card smoothly down into the bottom floating dock, cross-fading the hero heading into the live preview canvas without a page reload.

### 4.3 Aesthetics & Sensory Feedback
- **Colorway:** Cyber-Luxe Obsidian (`#07080D` base, `#0F121C` cards) with electric indigo/cyan glow accents (`#6366f1`, `#38bdf8`) and emerald verification lights (`#10b981`).
- **Web Audio Haptic Cues:** Soft, non-intrusive procedural synthesizer audio cues for prompt dispatch, HITL prompt notification, and successful deployment completion.

---

## 5. Event Streaming & Sandbox Preview Bridging

### 5.1 Custom `EveAgentReducer`
Transforms the raw Eve NDJSON event stream into a comprehensive studio state object:
- Tracks active subagent turns and thought tokens.
- Captures tool calls (`run_quality_commands`, `start_preview`, `run_security_review`, `deploy_to_vercel`).
- Parses pending `input.requested` objects for human-in-the-loop approvals.

### 5.2 Sandbox Preview Proxy (`/api/preview-proxy/[...path]`)
- Proxies requests from the client iframe directly to `http://127.0.0.1:4173` inside the Eve sandbox during local development.
- Automatically toggles to the public Vercel deployment URL when `deploy_to_vercel` succeeds.

---

## 6. Implementation Milestones

1. **Milestone 1: Project Setup & Next.js Monolith Foundation**
   - Install Next.js 15, Tailwind CSS, Lucide, Framer Motion, `@supabase/ssr`, and `@supabase/supabase-js`.
   - Wrap `next.config.ts` with `withEve()`.
   - Setup dark glassmorphism theme and CSS shader utilities.
2. **Milestone 2: Supabase Auth & Database Schema**
   - Create Supabase client/server utilities and middleware.
   - Configure SQL migration for `profiles`, `projects`, `sessions`, and `project_files`.
   - Implement Supabase JWT auth verification in `agent/channels/eve.ts`.
3. **Milestone 3: Core Studio Canvas & UI Primitives**
   - Build `StudioCanvas`, `HudPipeline`, `FloatingDock`, and `PreviewFrame`.
   - Implement responsive device frame toggles (Desktop/Tablet/Mobile).
   - Implement slide-out drawers for File Explorer / Monaco Editor and Terminal logs.
4. **Milestone 4: Eve Stream Wiring & HITL Integration**
   - Implement `EveAgentReducer` and wire `useEveAgent`.
   - Connect `ask_question` approval modal to `send({ inputResponses: ... })`.
   - Implement sandbox preview proxy route.
5. **Milestone 5: Hero Prompt Morph & Polish**
   - Build the landing page hero prompt and Framer Motion layout morph.
   - Add Web Audio synthesized sound feedback and glowing micro-interactions.
   - Run verification and ensure `scripts/smoke.mjs` passes 100%.

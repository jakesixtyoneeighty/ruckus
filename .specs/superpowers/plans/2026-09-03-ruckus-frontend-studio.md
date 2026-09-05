# Ruckus Frontend Studio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a consumer-grade, high-polish web frontend studio (Floating Glass Canvas) for Ruckus with Next.js 15+ App Router, Supabase Auth & Database, real-time Eve agent streaming, device-framed live preview, and micro-interactions.

**Architecture:** Monolithic architecture wrapping Next.js in the repository root with Eve's official `withEve(nextConfig)`. Eve routes `/eve/v1/*` mount on the same origin. A custom `EveAgentReducer` projects multi-agent runs, subagent thoughts, tool execution, and HITL design approvals into a cyber-luxe studio workspace.

**Tech Stack:** Next.js 15+ (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, Lucide React, `@supabase/ssr`, `@supabase/supabase-js`, `eve/react`, `eve/next`.

**Spec:** [`.specs/superpowers/specs/2026-09-03-ruckus-frontend-design.md`](file:///Users/jacobambroz/Documents/GitHub/eveable/.specs/superpowers/specs/2026-09-03-ruckus-frontend-design.md)

## Global Constraints
- `scripts/smoke.mjs` must remain 100% passing at all times.
- Never create a `docs/` folder in the root directory (strictly prohibited by `smoke.mjs`).
- `package.json`'s `dev` script must preserve: `rm -rf .eve .output .workflow-data && eve dev --no-ui --subagents hidden --tools collapsed --logs stderr`.
- Existing subagents and tools in `agent/` must remain fully operational.

---

### Task 1: Next.js Foundation & Monolith Configuration

**Files:**
- Create: `next.config.ts`
- Create: `tailwind.config.ts`
- Create: `postcss.config.mjs`
- Create: `app/globals.css`
- Modify: `package.json`

**Interfaces:**
- Produces: Working Next.js App Router base with `withEve()` wrapper, custom Tailwind glow & glassmorphism utilities, and verified package scripts.

- [ ] **Step 1: Install frontend dependencies**
Install Next.js, React, Tailwind, Framer Motion, Lucide, and Supabase client libraries:
`pnpm add next react react-dom framer-motion lucide-react clsx tailwind-merge @supabase/ssr @supabase/supabase-js`
`pnpm add -D tailwindcss postcss autoprefixer @types/react @types/react-dom`

- [ ] **Step 2: Configure `next.config.ts` with `withEve`**
Create `next.config.ts` wrapping configuration with `withEve` from `eve/next`:
```ts
import type { NextConfig } from "next";
import { withEve } from "eve/next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default withEve(nextConfig);
```

- [ ] **Step 3: Configure Tailwind and CSS shader utilities**
Create `tailwind.config.ts` and `app/globals.css` with dark obsidian palette (`#07080D`), glassmorphism backdrop blur filters, and aurora glow animations.

- [ ] **Step 4: Verify smoke tests and package scripts**
Run: `node scripts/smoke.mjs`
Expected: PASS ("smoke: Eveable project structure, release version, and model config look good.")

---

### Task 2: Supabase Integration & Inbound Route Auth

**Files:**
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/supabase/middleware.ts`
- Create: `supabase/schema.sql`
- Modify: `agent/channels/eve.ts`
- Modify: `env.sample`

**Interfaces:**
- Produces: Typed Supabase browser and server helpers, PostgreSQL database schema with RLS, and route authenticator in `agent/channels/eve.ts`.

- [ ] **Step 1: Create Supabase client and server utilities**
Implement `@supabase/ssr` browser and server clients in `lib/supabase/client.ts` and `lib/supabase/server.ts` reading `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

- [ ] **Step 2: Create SQL schema definition**
Create `supabase/schema.sql` defining `profiles`, `projects`, `sessions`, and `project_files` tables with RLS policies ensuring users can only read and write their own data.

- [ ] **Step 3: Update `agent/channels/eve.ts` route auth walk**
Add `supabaseAuth()` helper to verify Supabase JWT Bearer tokens for inbound `/eve/v1/session*` requests, falling back to `vercelOidc()` and `localDev()`.

- [ ] **Step 4: Update `env.sample`**
Document `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

---

### Task 3: Eve Streaming Reducer & Sandbox Preview Proxy

**Files:**
- Create: `lib/eve/agent-reducer.ts`
- Create: `lib/eve/types.ts`
- Create: `app/api/preview-proxy/[...path]/route.ts`

**Interfaces:**
- Consumes: `useEveAgent`, `EveAgentReducer`, `HandleMessageStreamEvent` from `eve/react` and `eve/client`.
- Produces: `studioReducer` returning `StudioState` (active subagent, thought trace, tool execution, HITL design approval request), and reverse proxy for `:4173`.

- [ ] **Step 1: Define studio state types**
Create `lib/eve/types.ts` defining `StudioState`, `SubagentStatus`, `ToolStep`, and `HITLRequest`.

- [ ] **Step 2: Implement custom `EveAgentReducer`**
Create `lib/eve/agent-reducer.ts` implementing `EveAgentReducer<StudioState>`. Catch `turn.started`, `actions.requested`, `step.completed`, and `input.requested` (for `ask_question`).

- [ ] **Step 3: Implement sandbox preview reverse proxy route**
Create `app/api/preview-proxy/[...path]/route.ts` fetching `http://127.0.0.1:4173/${path}` with streaming response, preventing CORS/mixed-content blocks inside the preview iframe.

---

### Task 4: High-Polish UI Components & Studio Canvas

**Files:**
- Create: `components/ui/glass-card.tsx`
- Create: `components/ui/button.tsx`
- Create: `components/studio/hud-pipeline.tsx`
- Create: `components/studio/preview-frame.tsx`
- Create: `components/studio/hitl-approval-modal.tsx`
- Create: `components/studio/floating-dock.tsx`
- Create: `components/studio/file-tree-drawer.tsx`
- Create: `components/studio/terminal-drawer.tsx`
- Create: `components/studio/sound-effects.ts`

**Interfaces:**
- Consumes: `StudioState` from `agent-reducer.ts`, `useEveAgent` actions (`send`, `stop`, `reset`).
- Produces: Modular studio components with Framer Motion animations and Web Audio sound feedback.

- [ ] **Step 1: Implement Web Audio sound effects**
Create `components/studio/sound-effects.ts` with lightweight procedural tones: `playSendSound()`, `playApprovalPromptSound()`, `playSuccessSound()`.

- [ ] **Step 2: Implement Top HUD Pipeline**
Create `components/studio/hud-pipeline.tsx` rendering animated node sequence: `Intent` $\to$ `Orchestrator` $\to$ `Design Research` $\to$ `Approval` $\to$ `Code Generator` $\to$ `Autofix` $\to$ `Preview & Security`. Active node has pulsing liquid glow ring.

- [ ] **Step 3: Implement Preview Frame with Device Bezels**
Create `components/studio/preview-frame.tsx` supporting Desktop (1440px / 100%), Tablet (768px), Mobile (375px) device bezel wrappers, reload button, URL copy, and live health badge.

- [ ] **Step 4: Implement HITL Design Approval Modal**
Create `components/studio/hitl-approval-modal.tsx` rendering the 12-bullet design spec, palette swatches, and action buttons (`Approve & Build`, `Revise`, `Stop`) calling `agent.send({ inputResponses: [...] })`.

- [ ] **Step 5: Implement Floating Command Dock & Slide-out Drawers**
Create `components/studio/floating-dock.tsx`, `components/studio/file-tree-drawer.tsx`, and `components/studio/terminal-drawer.tsx` with velocity-aware drag handles and backdrop blurs.

---

### Task 5: Studio Workspace Page & Hero Landing Morph

**Files:**
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/project/[id]/page.tsx`
- Create: `app/(auth)/login/page.tsx`
- Create: `components/studio/studio-canvas.tsx`

**Interfaces:**
- Consumes: Supabase auth state, `useEveAgent` hook.
- Produces: Complete navigable web studio: Landing page with liquid spring prompt morph into Studio Canvas, persistent project pages, and glass login.

- [ ] **Step 1: Implement Root Layout and Providers**
Create `app/layout.tsx` with Inter/Geist fonts, metadata, and obsidian background styling.

- [ ] **Step 2: Build Hero Landing Page with Framer Motion Morph**
Create `app/page.tsx` with centered glowing prompt card and suggestion pills. On submit, trigger layout morph into `StudioCanvas`.

- [ ] **Step 3: Build Studio Canvas Page (`/project/[id]`)**
Create `app/project/[id]/page.tsx` and `components/studio/studio-canvas.tsx` integrating `useEveAgent({ reducer: studioReducer })`, syncing session snapshots with Supabase on finish.

- [ ] **Step 4: Build Glassmorphic Login/Signup Page**
Create `app/(auth)/login/page.tsx` supporting Supabase GitHub/Google OAuth and magic link sign-in.

---

### Task 6: End-to-End Verification & Quality Audit

**Files:**
- Test: `scripts/smoke.mjs`
- Test: Next.js build (`pnpm run build`)
- Test: TypeScript typecheck (`pnpm run typecheck`)

- [ ] **Step 1: Run TypeScript Typecheck**
Run: `pnpm run typecheck`
Expected: 0 type errors.

- [ ] **Step 2: Run Ruckus Smoke Tests**
Run: `pnpm run smoke`
Expected: PASS ("smoke: Eveable project structure, release version, and model config look good.")

- [ ] **Step 3: Run Full Next.js Production Build**
Run: `pnpm run build`
Expected: Successful Next.js and Eve service compilation.

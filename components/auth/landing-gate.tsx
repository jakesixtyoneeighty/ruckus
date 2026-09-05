"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Hammer,
  Megaphone,
  Palette,
  PartyPopper,
  Rocket,
  SearchCheck,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { RuckusMark } from "@/components/studio/ruckus-mark";

type Mode = "signup" | "signin";

const CREW = [
  {
    icon: Palette,
    name: "The Designer",
    blurb: "Makes it look unreal. Layout, color, vibe — handled.",
    accent: "text-[#00d5ff]",
    ring: "hover:border-[#00d5ff]/40",
  },
  {
    icon: Hammer,
    name: "The Builder",
    blurb: "Turns your words into a real, working site or app.",
    accent: "text-[#ff5a1f]",
    ring: "hover:border-[#ff5a1f]/40",
  },
  {
    icon: SearchCheck,
    name: "The Checker",
    blurb: "Reviews every detail so nothing janky slips through.",
    accent: "text-emerald-300",
    ring: "hover:border-emerald-400/40",
  },
  {
    icon: Wrench,
    name: "The Fixer",
    blurb: "Squashes bugs and polishes rough edges automatically.",
    accent: "text-amber-300",
    ring: "hover:border-amber-300/40",
  },
];

const STEPS = [
  {
    icon: Megaphone,
    title: "You say what you want",
    blurb: "Plain words. No code, no specs, no blank-canvas panic. If you can describe it, you can build it.",
  },
  {
    icon: Sparkles,
    title: "The crew gets to work",
    blurb: "Design, build, review, and polish happen side by side — watch it come together live.",
  },
  {
    icon: Rocket,
    title: "You ship it",
    blurb: "Preview it, love it, put it on the internet. Your idea, live, in minutes not months.",
  },
];

export function LandingGate() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const urlError = searchParams.get("error");

  const supabase = useMemo(() => createClient(), []);

  const [mode, setMode] = useState<Mode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<"email" | "google" | "github" | null>(null);
  const [error, setError] = useState<string | null>(urlError);
  const [info, setInfo] = useState<string | null>(null);

  const afterAuth = () => {
    router.push(next);
    router.refresh();
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setLoading(provider);
    setError(null);
    setInfo(null);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (oauthError) throw oauthError;
    } catch (err: any) {
      setError(err?.message || `Couldn't connect to ${provider}. Try again.`);
      setLoading(null);
    }
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Add your email and a password to keep going.");
      return;
    }
    setLoading("email");
    setError(null);
    setInfo(null);
    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
          },
        });
        if (signUpError) throw signUpError;
        if (data.session) {
          afterAuth();
          return;
        }
        setInfo(
          "You're on the list! Check your inbox to confirm your email, then come back and sign in."
        );
      } else {
        const { data, error: signInError } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });
        if (signInError) throw signInError;
        if (data.session) {
          afterAuth();
          return;
        }
      }
    } catch (err: any) {
      setError(err?.message || "Something went sideways. Try again.");
    } finally {
      setLoading(null);
    }
  };

  const scrollToAuth = () => {
    document.getElementById("get-started")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="ruckus-grain relative min-h-screen overflow-hidden bg-[#0a0b0d] text-[#f5f1e8]">
      {/* Ambient glows */}
      <div className="aurora-glow left-1/2 top-[-120px] h-[420px] w-[720px] -translate-x-1/2" />
      <div
        className="aurora-glow left-[-160px] top-[55%] h-[380px] w-[380px] opacity-60"
        style={{
          background:
            "radial-gradient(circle, rgba(255,90,31,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Nav */}
      <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 sm:px-6">
        <div className="flex items-center gap-2.5">
          <RuckusMark size={32} />
          <span className="text-base font-extrabold uppercase tracking-tight">
            Ruckus
          </span>
        </div>
        <button
          onClick={() => {
            setMode("signin");
            scrollToAuth();
          }}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-[#00d5ff]/40 hover:text-white"
        >
          Sign in
        </button>
      </header>

      <main className="relative z-20 mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
        {/* Hero */}
        <section className="mx-auto max-w-3xl pt-6 text-center sm:pt-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-[#ff5a1f]/40 bg-[#ff5a1f]/10 px-3 py-1 text-xs font-semibold text-[#ff8a5c] shadow-[0_0_20px_rgba(255,90,31,0.15)]">
              <PartyPopper className="h-3 w-3 text-[#ff5a1f]" />
              <span>Your ideas are about to get loud</span>
            </div>
            <h1 className="ruckus-display mb-4 text-4xl leading-[1.02] sm:text-6xl">
              You bring the idea.{" "}
              <span className="tilt text-[#00d5ff]">Ruckus</span> brings the{" "}
              <span className="paint-underline">
                crew.
                <svg viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M4 10 C 60 4, 140 4, 196 8" />
                </svg>
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-[#9ba3ab] sm:text-base">
              Got a business, a side hustle, a wild late-night idea? Describe it
              in plain words and watch a whole crew turn it into a real website
              or app — designed, built, checked, and shipped while you watch.
              No code. No headaches. Just vibes and velocity.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={() => {
                  setMode("signup");
                  scrollToAuth();
                }}
                className="cta-ruckus flex items-center gap-2 rounded-lg bg-[#ff5a1f] px-6 py-2.5 text-sm font-bold text-[#0a0b0d] shadow-[0_4px_20px_rgba(255,90,31,0.45)]"
              >
                <span>Start building — it&apos;s free</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="rounded-lg border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-[#00d5ff]/40 hover:text-white"
              >
                See how it works
              </button>
            </div>
            <p className="mt-4 text-[11px] text-slate-500">
              Free to start · No credit card · Live in minutes
            </p>
          </motion.div>
        </section>

        {/* Auth + how it works */}
        <section className="mx-auto mt-14 grid w-full max-w-5xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          {/* How it works */}
          <motion.div
            id="how-it-works"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-xl border border-white/10 bg-[#101214]/90 p-6 sm:p-7"
          >
            <div className="mb-1 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#00d5ff]">
              <Zap className="h-3.5 w-3.5" />
              <span>How it works</span>
            </div>
            <h2 className="ruckus-display mb-5 text-2xl sm:text-3xl">
              Stupid simple. Seriously.
            </h2>
            <div className="space-y-4">
              {STEPS.map((s, i) => (
                <div
                  key={s.title}
                  className="flex gap-4 rounded-lg border border-white/5 bg-white/[0.03] p-4 transition hover:border-[#00d5ff]/30"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#0a0b0d]">
                    <s.icon className="h-4 w-4 text-[#00d5ff]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Step {i + 1}
                    </p>
                    <p className="text-sm font-bold text-[#f5f1e8]">{s.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-[#9ba3ab]">
                      {s.blurb}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {CREW.map((c) => (
                <div
                  key={c.name}
                  className={`rounded-lg border border-white/10 bg-[#0a0b0d]/60 p-4 transition ${c.ring}`}
                >
                  <c.icon className={`mb-2 h-4 w-4 ${c.accent}`} />
                  <p className="text-sm font-bold">{c.name}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#9ba3ab]">
                    {c.blurb}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Auth card */}
          <motion.div
            id="get-started"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
            className="scroll-mt-8 overflow-hidden rounded-xl border border-white/15 bg-[#101214]/95 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_32px_rgba(0,213,255,0.08)]"
          >
            <div className="border-b border-white/10 bg-gradient-to-r from-[#00d5ff]/10 via-transparent to-[#ff5a1f]/10 p-6 text-center">
              <RuckusMark size={44} className="mx-auto mb-2" />
              <h2 className="text-xl font-extrabold uppercase tracking-tight">
                {mode === "signup" ? "Join the Ruckus" : "Welcome back"}
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                {mode === "signup"
                  ? "Create your free account and ship your first idea tonight."
                  : "Sign in to pick up right where you left off."}
              </p>
            </div>

            <div className="p-6">
              {/* Tabs */}
              <div className="mb-5 grid grid-cols-2 gap-1 rounded-lg border border-white/10 bg-white/5 p-1 text-xs font-bold">
                <button
                  onClick={() => {
                    setMode("signup");
                    setError(null);
                    setInfo(null);
                  }}
                  className={`rounded-md px-3 py-2 transition ${
                    mode === "signup"
                      ? "bg-[#ff5a1f] text-[#0a0b0d] shadow-[0_4px_16px_rgba(255,90,31,0.4)]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Sign up free
                </button>
                <button
                  onClick={() => {
                    setMode("signin");
                    setError(null);
                    setInfo(null);
                  }}
                  className={`rounded-md px-3 py-2 transition ${
                    mode === "signin"
                      ? "bg-[#00d5ff] text-[#0a0b0d] shadow-[0_4px_16px_rgba(0,213,255,0.35)]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Sign in
                </button>
              </div>

              {error && (
                <div className="mb-4 flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              {info && (
                <div className="mb-4 flex items-start gap-2 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3 text-xs text-emerald-200">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{info}</span>
                </div>
              )}

              <form onSubmit={handleEmail} className="space-y-3">
                <label className="block">
                  <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Email
                  </span>
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-white/10 bg-[#0a0b0d] px-3.5 py-2.5 text-sm text-[#f5f1e8] placeholder-slate-600 outline-none transition focus:border-[#00d5ff]/50"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Password
                  </span>
                  <input
                    type="password"
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={
                      mode === "signup" ? "Pick something strong" : "Your password"
                    }
                    className="w-full rounded-lg border border-white/10 bg-[#0a0b0d] px-3.5 py-2.5 text-sm text-[#f5f1e8] placeholder-slate-600 outline-none transition focus:border-[#00d5ff]/50"
                  />
                </label>
                <button
                  type="submit"
                  disabled={loading !== null}
                  className="cta-ruckus flex w-full items-center justify-center gap-2 rounded-lg bg-[#ff5a1f] px-4 py-2.5 text-sm font-bold text-[#0a0b0d] shadow-[0_4px_20px_rgba(255,90,31,0.45)] transition disabled:opacity-50"
                >
                  {loading === "email" ? (
                    <span className="text-xs">
                      {mode === "signup" ? "Creating your account…" : "Signing you in…"}
                    </span>
                  ) : (
                    <>
                      <span>
                        {mode === "signup" ? "Create my free account" : "Sign in"}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="my-5 flex items-center gap-3 text-[11px] text-slate-500">
                <span className="h-px flex-1 bg-white/10" />
                <span>or continue with</span>
                <span className="h-px flex-1 bg-white/10" />
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  disabled={loading !== null}
                  onClick={() => handleOAuth("google")}
                  className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white transition hover:border-[#00d5ff]/40 hover:bg-white/10 disabled:opacity-50"
                >
                  {loading === "google" ? (
                    <span className="text-slate-400">Connecting to Google…</span>
                  ) : (
                    <>
                      <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  disabled={loading !== null}
                  onClick={() => handleOAuth("github")}
                  className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white transition hover:border-[#00d5ff]/40 hover:bg-white/10 disabled:opacity-50"
                >
                  {loading === "github" ? (
                    <span className="text-slate-400">Connecting to GitHub…</span>
                  ) : (
                    <>
                      <svg className="h-4 w-4 shrink-0 fill-current" viewBox="0 0 24 24">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        />
                      </svg>
                      <span>Continue with GitHub</span>
                    </>
                  )}
                </button>
              </div>

              <p className="mt-5 text-center text-xs text-slate-400">
                {mode === "signup" ? (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => {
                        setMode("signin");
                        setError(null);
                        setInfo(null);
                      }}
                      className="font-bold text-[#00d5ff] hover:underline"
                    >
                      Sign in
                    </button>
                  </>
                ) : (
                  <>
                    New here?{" "}
                    <button
                      onClick={() => {
                        setMode("signup");
                        setError(null);
                        setInfo(null);
                      }}
                      className="font-bold text-[#ff5a1f] hover:underline"
                    >
                      Create a free account
                    </button>
                  </>
                )}
              </p>
              <p className="mt-4 text-center text-[11px] leading-relaxed text-slate-500">
                By continuing, you agree to our Terms of Service and Privacy
                Policy.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Hype strip */}
        <section className="mx-auto mt-12 max-w-5xl rounded-xl border border-[#ff5a1f]/25 bg-gradient-to-r from-[#ff5a1f]/10 via-[#101214] to-[#00d5ff]/10 p-6 text-center sm:p-8">
          <p className="ruckus-display text-xl sm:text-2xl">
            Stop dreaming it. <span className="text-[#00d5ff]">Start shipping it.</span>
          </p>
          <p className="mx-auto mt-2 max-w-lg text-xs leading-relaxed text-[#9ba3ab] sm:text-sm">
            Your next customer, fan, or investor is one wild idea away. Ruckus
            turns &ldquo;someday&rdquo; into &ldquo;it&apos;s live&rdquo; —
            tonight.
          </p>
          <button
            onClick={() => {
              setMode("signup");
              scrollToAuth();
            }}
            className="cta-ruckus mx-auto mt-5 flex items-center gap-2 rounded-lg bg-[#ff5a1f] px-6 py-2.5 text-sm font-bold text-[#0a0b0d] shadow-[0_4px_20px_rgba(255,90,31,0.45)]"
          >
            <span>Make some noise</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </section>
      </main>

      <footer className="relative z-20 pb-8 text-center text-xs text-slate-600">
        A sixtyoneeighty product · Crew powered by Eve
      </footer>
    </div>
  );
}

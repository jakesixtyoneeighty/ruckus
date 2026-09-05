"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ArrowRight, Paperclip, Palette, Zap, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StudioCanvas } from "@/components/studio/studio-canvas";
import { RuckusMark } from "@/components/studio/ruckus-mark";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const SUGGESTIONS = [
  "Cyberpunk Ramen Bar with interactive table reservation & neon audio vibes",
  "High-converting AI Video SaaS landing page with Bento grid & pricing toggle",
  "Developer Portfolio with 3D canvas, project timeline, and contact modal",
  "Minimalist E-Commerce Store with animated cart drawer and product filters",
];

export function HomeClient({ initialUser }: { initialUser: SupabaseUser | null }) {
  const [prompt, setPrompt] = useState("");
  const [activeSessionPrompt, setActiveSessionPrompt] = useState<string | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(initialUser);

  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setActiveSessionPrompt(null);
    // Back to the landing/login gate — the server component re-checks the
    // session on refresh and serves the gate when signed out.
    router.push("/");
    router.refresh();
  };

  const handleStartBuild = (selectedPrompt?: string) => {
    const p = selectedPrompt || prompt;
    if (!p.trim()) return;
    setActiveSessionPrompt(p.trim());
  };

  return (
    <AnimatePresence mode="wait">
      {activeSessionPrompt ? (
        <motion.div
          key="studio"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="h-screen w-screen"
        >
          <StudioCanvas initialPrompt={activeSessionPrompt} />
        </motion.div>
      ) : (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="ruckus-grain relative flex min-h-screen flex-col items-center justify-between overflow-hidden px-4 py-8 bg-[#0a0b0d]"
        >
          {/* Ambient spray-mist glow */}
          <div className="aurora-glow top-[-50px] left-1/2 h-[450px] w-[750px] -translate-x-1/2" />

          {/* Top Navbar */}
          <header className="relative z-20 flex w-full max-w-5xl items-center justify-between">
            <div className="flex items-center gap-2.5">
              <RuckusMark size={32} />
              <span className="text-base font-extrabold uppercase tracking-tight text-[#f5f1e8]">
                Ruckus
              </span>
            </div>

            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-2.5">
                  {/* Logged in indicator */}
                  <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    </span>
                    {user.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="Profile"
                        className="h-4 w-4 rounded-full border border-white/20 object-cover"
                      />
                    ) : (
                      <User className="h-3.5 w-3.5 text-[#00d5ff]" />
                    )}
                    <span className="max-w-[120px] truncate font-medium text-[#f5f1e8] sm:max-w-[180px]">
                      {user.user_metadata?.full_name ||
                        user.user_metadata?.name ||
                        user.email?.split("@")[0] ||
                        "Logged in"}
                    </span>
                  </div>

                  {/* Log Out Button */}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300"
                    title="Log out"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Log Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-slate-300 transition hover:border-[#00d5ff]/40 hover:text-white"
                >
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </header>

          {/* Hero Center Content */}
          <div className="relative z-20 flex w-full max-w-3xl flex-col items-center text-center my-auto">
            {/* Pill Tag */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-[#ff5a1f]/40 bg-[#ff5a1f]/10 px-3 py-1 text-xs font-semibold text-[#ff8a5c] shadow-[0_0_20px_rgba(255,90,31,0.15)]">
              <Zap className="h-3 w-3 text-[#ff5a1f]" />
              <span>One prompt. An entire AI dev crew.</span>
            </div>

            {/* Headline */}
            <h1 className="ruckus-display mb-4 text-4xl sm:text-6xl text-[#f5f1e8]">
              You have the idea.{" "}
              <span className="tilt text-[#00d5ff]">Ruckus</span> has the{" "}
              <span className="paint-underline">
                crew.
                <svg viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M4 10 C 60 4, 140 4, 196 8" />
                </svg>
              </span>
            </h1>

            <p className="mb-8 max-w-xl text-sm sm:text-base text-[#9ba3ab] leading-relaxed">
              Tell Ruckus what you want. Specialized agents put the right
              intelligence on each part of the job — then design, write, check,
              build, fix, and ship working software.
            </p>

            {/* Centered Hero Prompt Box */}
            <div className="w-full rounded-xl border border-white/15 bg-[#101214]/90 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_32px_rgba(0,213,255,0.08)] transition duration-300 focus-within:border-[#00d5ff]/50 focus-within:shadow-[0_24px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(0,213,255,0.15)]">
              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleStartBuild();
                  }
                }}
                placeholder="Describe it. We'll assemble the crew — e.g. a dark-mode landing page for a generative AI music platform with waveform visualizer, pricing cards, and reviews..."
                className="w-full resize-none bg-transparent text-sm sm:text-base text-[#f5f1e8] placeholder-[#9ba3ab]/60 outline-none leading-relaxed"
              />

              <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <button className="flex items-center gap-1 rounded-lg border border-white/5 bg-white/5 px-2.5 py-1 transition hover:bg-white/10 hover:text-white">
                    <Paperclip className="h-3 w-3" />
                    <span className="hidden sm:inline">Attach Spec</span>
                  </button>
                  <button className="flex items-center gap-1 rounded-lg border border-white/5 bg-white/5 px-2.5 py-1 transition hover:bg-white/10 hover:text-white">
                    <Palette className="h-3 w-3 text-[#00d5ff]" />
                    <span className="hidden sm:inline">Refero Design</span>
                  </button>
                </div>

                <button
                  onClick={() => handleStartBuild()}
                  disabled={!prompt.trim()}
                  className="cta-ruckus flex items-center gap-1.5 rounded-lg bg-[#ff5a1f] px-5 py-2 text-xs sm:text-sm font-bold text-[#0a0b0d] shadow-[0_4px_20px_rgba(255,90,31,0.45)] transition disabled:opacity-40"
                >
                  <span>Start a Ruckus</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Suggestions Chips */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPrompt(s);
                    handleStartBuild(s);
                  }}
                  className="rounded-lg border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-slate-400 transition hover:border-[#00d5ff]/40 hover:bg-[#00d5ff]/10 hover:text-white"
                >
                  <span>✦ {s}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <footer className="relative z-20 text-center text-xs text-slate-600">
            A sixtyoneeighty product · Crew powered by Eve
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

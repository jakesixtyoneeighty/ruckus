"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, Paperclip, Palette, Zap, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StudioCanvas } from "@/components/studio/studio-canvas";
import Link from "next/link";

const SUGGESTIONS = [
  "Cyberpunk Ramen Bar with interactive table reservation & neon audio vibes",
  "High-converting AI Video SaaS landing page with Bento grid & pricing toggle",
  "Developer Portfolio with 3D canvas, project timeline, and contact modal",
  "Minimalist E-Commerce Store with animated cart drawer and product filters",
];

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [activeSessionPrompt, setActiveSessionPrompt] = useState<string | null>(null);

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
          className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden px-4 py-8 bg-[#07080d]"
        >
          {/* Ambient Aurora Glow */}
          <div className="pointer-events-none absolute top-[-50px] left-1/2 -translate-x-1/2 h-[450px] w-[750px] bg-radial from-indigo-500/25 via-purple-500/15 to-transparent blur-[90px]" />

          {/* Top Navbar */}
          <header className="relative z-20 flex w-full max-w-5xl items-center justify-between">
            <div className="flex items-center gap-2.5 font-bold text-base tracking-tight text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-[0_0_16px_rgba(168,85,247,0.5)]">
                <Sparkles className="h-4 w-4" />
              </div>
              <span>Eveable</span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <User className="h-3.5 w-3.5 text-slate-400" />
                <span>Sign In</span>
              </Link>
            </div>
          </header>

          {/* Hero Center Content */}
          <div className="relative z-20 flex w-full max-w-3xl flex-col items-center text-center my-auto">
            {/* Pill Tag */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
              <Zap className="h-3 w-3 text-purple-400" />
              <span>Multi-Agent Autonomous Full-Stack Builder</span>
            </div>

            {/* Headline */}
            <h1 className="mb-4 text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              What would you like to build?
            </h1>

            <p className="mb-8 max-w-xl text-sm sm:text-base text-slate-400 leading-relaxed">
              Describe your idea. Eveable will autonomously architect the solution, research designs, validate code in a sandbox, and deploy to Vercel.
            </p>

            {/* Centered Hero Prompt Box */}
            <div className="w-full rounded-2xl border border-white/15 bg-[#0f1322]/85 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(99,102,241,0.15)] backdrop-blur-3xl transition duration-300 focus-within:border-purple-500/50 focus-within:shadow-[0_24px_70px_rgba(0,0,0,0.9),0_0_50px_rgba(168,85,247,0.25)]">
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
                placeholder="Build a sleek dark-mode landing page for a generative AI music platform with waveform audio visualizer, pricing cards, and customer reviews..."
                className="w-full resize-none bg-transparent text-sm sm:text-base text-white placeholder-slate-500 outline-none leading-relaxed"
              />

              <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <button className="flex items-center gap-1 rounded-lg border border-white/5 bg-white/5 px-2.5 py-1 transition hover:bg-white/10 hover:text-white">
                    <Paperclip className="h-3 w-3" />
                    <span className="hidden sm:inline">Attach Spec</span>
                  </button>
                  <button className="flex items-center gap-1 rounded-lg border border-white/5 bg-white/5 px-2.5 py-1 transition hover:bg-white/10 hover:text-white">
                    <Palette className="h-3 w-3 text-purple-400" />
                    <span className="hidden sm:inline">Refero Design</span>
                  </button>
                </div>

                <button
                  onClick={() => handleStartBuild()}
                  disabled={!prompt.trim()}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-[0_4px_16px_rgba(168,85,247,0.5)] transition hover:brightness-110 disabled:opacity-40 disabled:hover:brightness-100"
                >
                  <span>Build with Eve</span>
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
                  className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-slate-400 transition hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-white"
                >
                  <span>✦ {s}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <footer className="relative z-20 text-center text-xs text-slate-600">
            Powered by Vercel Eve Agent Framework & Supabase Database
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

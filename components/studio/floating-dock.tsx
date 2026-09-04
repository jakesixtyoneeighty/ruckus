"use client";

import React, { useState } from "react";
import { Sparkles, Send, FolderCode, Terminal, ShieldAlert, ShieldCheck, Loader2 } from "lucide-react";
import { playSendSound } from "./sound-effects";

interface FloatingDockProps {
  onSendPrompt: (prompt: string) => Promise<void>;
  isBusy: boolean;
  fileCount: number;
  terminalLogCount: number;
  securityPassed: boolean | null;
  onToggleFiles: () => void;
  onToggleTerminal: () => void;
  onToggleSecurity: () => void;
  soundEnabled: boolean;
}

export function FloatingDock({
  onSendPrompt,
  isBusy,
  fileCount,
  terminalLogCount,
  securityPassed,
  onToggleFiles,
  onToggleTerminal,
  onToggleSecurity,
  soundEnabled,
}: FloatingDockProps) {
  const [input, setInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = input.trim();
    if (!prompt || isBusy) return;

    if (soundEnabled) {
      playSendSound();
    }

    setInput("");
    await onSendPrompt(prompt);
  };

  return (
    <div className="absolute bottom-6 left-1/2 z-40 w-full max-w-2xl -translate-x-1/2 px-4">
      <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#121622]/85 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(99,102,241,0.15)] backdrop-blur-3xl transition-all duration-300 focus-within:border-indigo-500/50 focus-within:shadow-[0_24px_60px_rgba(0,0,0,0.9),0_0_50px_rgba(99,102,241,0.25)]">
        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 py-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500/30 to-purple-500/30 text-purple-300">
            {isBusy ? <Loader2 className="h-4 w-4 animate-spin text-cyan-400" /> : <Sparkles className="h-4 w-4" />}
          </div>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isBusy}
            placeholder={
              isBusy
                ? "Eveable is actively executing..."
                : "Ask Eveable to refine, add new sections, modify styling..."
            }
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={isBusy || !input.trim()}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-[0_2px_12px_rgba(168,85,247,0.4)] transition hover:brightness-110 disabled:opacity-40 disabled:hover:brightness-100"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>

        {/* Drawer Toggles Strip */}
        <div className="flex items-center justify-between border-t border-white/5 pt-2 px-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <button
              onClick={onToggleFiles}
              className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/5 px-2.5 py-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              <FolderCode className="h-3 w-3 text-indigo-400" />
              <span>Files ({fileCount})</span>
            </button>

            <button
              onClick={onToggleTerminal}
              className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/5 px-2.5 py-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              <Terminal className="h-3 w-3 text-cyan-400" />
              <span>Terminal ({terminalLogCount})</span>
            </button>

            <button
              onClick={onToggleSecurity}
              className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/5 px-2.5 py-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              {securityPassed === true ? (
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
              ) : securityPassed === false ? (
                <ShieldAlert className="h-3 w-3 text-rose-400" />
              ) : (
                <ShieldCheck className="h-3 w-3 text-slate-500" />
              )}
              <span>Security</span>
            </button>
          </div>

          <span className="hidden sm:inline font-mono text-[10px] text-slate-600">
            Press Enter ↵
          </span>
        </div>
      </div>
    </div>
  );
}

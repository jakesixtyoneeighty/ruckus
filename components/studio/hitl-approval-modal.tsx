"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, RefreshCw, XCircle, Zap, Layers } from "lucide-react";
import type { EveMessageInputRequest } from "eve/react";
import { playApprovalPromptSound } from "./sound-effects";

interface HitlApprovalModalProps {
  request: EveMessageInputRequest;
  onRespond: (optionId: string, customText?: string) => Promise<void>;
  soundEnabled: boolean;
}

export function HitlApprovalModal({
  request,
  onRespond,
  soundEnabled,
}: HitlApprovalModalProps) {
  const [revisionNotes, setRevisionNotes] = useState("");
  const [showRevisionInput, setShowRevisionInput] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (soundEnabled) {
      playApprovalPromptSound();
    }
  }, [soundEnabled]);

  const handleAction = async (optionId: string) => {
    if (optionId === "Revise design" && !showRevisionInput) {
      setShowRevisionInput(true);
      return;
    }

    setSubmitting(true);
    try {
      await onRespond(optionId, revisionNotes.trim() || undefined);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="absolute top-6 right-6 z-50 w-full max-w-md animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="overflow-hidden rounded-xl border border-[#ff5a1f]/40 bg-[#101214]/95 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(255,90,31,0.15)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="crew-pulse relative flex h-2 w-2 rounded-full bg-[#ff5a1f]">
              <span className="crew-ping bg-[#ff5a1f]" />
            </span>
            <span className="rounded-md bg-[#ff5a1f]/15 border border-[#ff5a1f]/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#ff8a5c]">
              Crew needs a call
            </span>
          </div>
          <span className="text-xs text-slate-500 font-mono">Step: Design Gate</span>
        </div>

        {/* Title & Description */}
        <div className="flex items-start gap-3 mb-4">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#ff5a1f]/15 text-[#ff8a5c] border border-[#ff5a1f]/40 shadow-inner">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#f5f1e8] tracking-tight">
              {request.prompt || "Review & Approve Implementation Plan"}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              The crew drafted your architecture & visual plan. Approve to start the build, or send it back with notes.
            </p>
          </div>
        </div>

        {/* Revision Input (if toggled) */}
        {showRevisionInput && (
          <div className="mb-4 animate-in fade-in duration-200">
            <label className="text-[11px] font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Layers className="h-3 w-3 text-[#ff5a1f]" />
              <span>What would you like revised?</span>
            </label>
            <textarea
              rows={3}
              value={revisionNotes}
              onChange={(e) => setRevisionNotes(e.target.value)}
              placeholder="e.g., Swap the hero to a bolder headline, add a pricing tier calculator..."
              className="w-full rounded-lg border border-white/10 bg-black/40 p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-[#ff5a1f]/50 focus:ring-1 focus:ring-[#ff5a1f]/50"
            />
          </div>
        )}

        {/* Options / Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {/* Approve and Build */}
          <button
            disabled={submitting}
            onClick={() => handleAction("Approve and build")}
            className="cta-ruckus flex items-center justify-center gap-1.5 rounded-lg bg-[#00d5ff] py-2.5 px-3 text-xs font-bold text-[#0a0b0d] shadow-[0_4px_16px_rgba(0,213,255,0.35)] transition disabled:opacity-50"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Approve</span>
          </button>

          {/* Revise Design */}
          <button
            disabled={submitting}
            onClick={() => handleAction("Revise design")}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 py-2.5 px-3 text-xs font-semibold text-slate-200 transition hover:bg-white/10 disabled:opacity-50"
          >
            <RefreshCw className="h-3.5 w-3.5 text-[#00d5ff]" />
            <span>{showRevisionInput ? "Submit" : "Revise"}</span>
          </button>

          {/* Stop */}
          <button
            disabled={submitting}
            onClick={() => handleAction("Stop")}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 py-2.5 px-3 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/20 disabled:opacity-50"
          >
            <XCircle className="h-3.5 w-3.5" />
            <span>Stop</span>
          </button>
        </div>
      </div>
    </div>
  );
}

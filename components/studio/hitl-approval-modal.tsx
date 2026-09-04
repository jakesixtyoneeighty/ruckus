"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, RefreshCw, XCircle, Sparkles, Layers } from "lucide-react";
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
      <div className="overflow-hidden rounded-2xl border border-amber-400/30 bg-[#0f121d]/95 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(251,191,36,0.15)] backdrop-blur-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
            <span className="rounded-full bg-amber-400/15 border border-amber-400/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
              Human Approval Required
            </span>
          </div>
          <span className="text-xs text-slate-500 font-mono">Step: Design Gate</span>
        </div>

        {/* Title & Description */}
        <div className="flex items-start gap-3 mb-4">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300 border border-amber-400/30 shadow-inner">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">
              {request.prompt || "Review & Approve Implementation Plan"}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              Eve generated a tailored architecture & visual design plan. Approve to proceed with generation, or request revisions.
            </p>
          </div>
        </div>

        {/* Revision Input (if toggled) */}
        {showRevisionInput && (
          <div className="mb-4 animate-in fade-in duration-200">
            <label className="text-[11px] font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Layers className="h-3 w-3 text-amber-400" />
              <span>What would you like revised?</span>
            </label>
            <textarea
              rows={3}
              value={revisionNotes}
              onChange={(e) => setRevisionNotes(e.target.value)}
              placeholder="e.g., Use dark neon purple accents instead of blue, add a pricing tier calculator..."
              className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50"
            />
          </div>
        )}

        {/* Options / Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {/* Approve and Build */}
          <button
            disabled={submitting}
            onClick={() => handleAction("Approve and build")}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-2.5 px-3 text-xs font-semibold text-white shadow-[0_4px_16px_rgba(16,185,129,0.35)] transition hover:brightness-110 disabled:opacity-50"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Approve</span>
          </button>

          {/* Revise Design */}
          <button
            disabled={submitting}
            onClick={() => handleAction("Revise design")}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2.5 px-3 text-xs font-semibold text-slate-200 transition hover:bg-white/10 disabled:opacity-50"
          >
            <RefreshCw className="h-3.5 w-3.5 text-amber-400" />
            <span>{showRevisionInput ? "Submit" : "Revise"}</span>
          </button>

          {/* Stop */}
          <button
            disabled={submitting}
            onClick={() => handleAction("Stop")}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 py-2.5 px-3 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/20 disabled:opacity-50"
          >
            <XCircle className="h-3.5 w-3.5" />
            <span>Stop</span>
          </button>
        </div>
      </div>
    </div>
  );
}

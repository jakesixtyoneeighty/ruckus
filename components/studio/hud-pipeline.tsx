"use client";

import React from "react";
import { Sparkles, Check, ArrowRight, ExternalLink, ShieldCheck, Volume2, VolumeX } from "lucide-react";
import type { SubagentType, PipelineStage } from "@/lib/eve/types";

interface HudPipelineProps {
  activeSubagent: SubagentType | null;
  pipelineStage: PipelineStage;
  vercelDeploymentUrl: string | null;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onDeployClick: () => void;
}

interface NodeDef {
  id: string;
  label: string;
  subagents: SubagentType[];
  stageMatcher: PipelineStage[];
}

const PIPELINE_NODES: NodeDef[] = [
  {
    id: "intent",
    label: "Intent",
    subagents: ["intent"],
    stageMatcher: ["planning"],
  },
  {
    id: "orchestrator",
    label: "Orchestrator",
    subagents: ["orchestrator"],
    stageMatcher: ["planning"],
  },
  {
    id: "design",
    label: "Design Research",
    subagents: ["design_research"],
    stageMatcher: ["planning"],
  },
  {
    id: "approval",
    label: "Design Approval",
    subagents: [],
    stageMatcher: ["approval"],
  },
  {
    id: "generator",
    label: "Code Generator",
    subagents: ["code_writer"],
    stageMatcher: ["generating"],
  },
  {
    id: "autofix",
    label: "Autofix",
    subagents: ["autofix"],
    stageMatcher: ["validating"],
  },
  {
    id: "verify",
    label: "Preview & Security",
    subagents: ["security_review"],
    stageMatcher: ["validating", "preview_ready", "deployed"],
  },
];

export function HudPipeline({
  activeSubagent,
  pipelineStage,
  vercelDeploymentUrl,
  soundEnabled,
  onToggleSound,
  onDeployClick,
}: HudPipelineProps) {
  // Determine completed stages
  const isStagePast = (index: number) => {
    const stageOrder: PipelineStage[] = [
      "idle",
      "planning",
      "approval",
      "generating",
      "validating",
      "preview_ready",
      "deployed",
    ];
    const currentIndex = stageOrder.indexOf(pipelineStage);
    return currentIndex > index;
  };

  return (
    <header className="relative z-30 mx-4 mt-3 mb-2 flex items-center justify-between rounded-full border border-white/10 bg-[#0f1322]/80 px-4 py-2 shadow-2xl backdrop-blur-2xl">
      {/* Brand */}
      <div className="flex items-center gap-2 font-bold text-sm tracking-tight text-white">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.5)]">
          <Sparkles className="h-3.5 w-3.5" />
        </div>
        <span className="hidden sm:inline">Eveable Studio</span>
      </div>

      {/* Nodes Strip */}
      <nav className="flex items-center gap-1.5 overflow-x-auto py-0.5 text-xs">
        {PIPELINE_NODES.map((node, i) => {
          const isActiveSubagent = activeSubagent ? node.subagents.includes(activeSubagent) : false;
          const isNodeActive = isActiveSubagent || (node.id === "approval" && pipelineStage === "approval");
          const isDone = isStagePast(i) || (pipelineStage === "deployed");

          return (
            <React.Fragment key={node.id}>
              {i > 0 && <ArrowRight className="h-3 w-3 flex-shrink-0 text-slate-600" />}

              <div
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium transition-all duration-300 ${
                  isNodeActive
                    ? node.id === "approval"
                      ? "border border-amber-400/40 bg-amber-400/15 text-amber-300 shadow-[0_0_16px_rgba(251,191,36,0.25)] animate-pulse"
                      : "border border-cyan-400/40 bg-cyan-400/15 text-cyan-300 shadow-[0_0_16px_rgba(56,189,248,0.25)] animate-pulse"
                    : isDone
                    ? "bg-white/5 text-slate-300"
                    : "bg-transparent text-slate-500"
                }`}
              >
                {isDone ? (
                  <Check className="h-3 w-3 text-emerald-400" />
                ) : isNodeActive ? (
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500"></span>
                  </span>
                ) : null}
                <span className="whitespace-nowrap">{node.label}</span>
              </div>
            </React.Fragment>
          );
        })}
      </nav>

      {/* Quick Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSound}
          title={soundEnabled ? "Mute audio cues" : "Enable audio cues"}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
        >
          {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
        </button>

        {vercelDeploymentUrl ? (
          <a
            href={vercelDeploymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-300 shadow-[0_0_14px_rgba(16,185,129,0.3)] transition hover:bg-emerald-500/25"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Deployed Live</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <button
            onClick={onDeployClick}
            className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1 text-xs font-semibold text-black shadow-[0_0_14px_rgba(255,255,255,0.4)] transition hover:bg-slate-200"
          >
            <span>Deploy</span>
          </button>
        )}
      </div>
    </header>
  );
}

"use client";

import React, { useRef, useEffect } from "react";
import { X, Terminal as TerminalIcon, Trash2, Copy, Check } from "lucide-react";

interface TerminalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  logs: string[];
  onClearLogs: () => void;
}

export function TerminalDrawer({
  isOpen,
  onClose,
  logs,
  onClearLogs,
}: TerminalDrawerProps) {
  const [copied, setCopied] = React.useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, logs]);

  if (!isOpen) return null;

  const handleCopyLogs = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(logs.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="absolute inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col border-l border-white/10 bg-[#0a0b0d]/95 shadow-2xl animate-in slide-in-from-right duration-300">
      {/* Top Bar */}
      <div className="flex h-12 items-center justify-between border-b border-white/10 bg-[#101214] px-5">
        <div className="flex items-center gap-2">
          <TerminalIcon className="h-4 w-4 text-[#00d5ff]" />
          <span className="text-sm font-semibold text-[#f5f1e8]">Execution Console & Quality Logs</span>
          <span className="rounded-md bg-[#00d5ff]/10 border border-[#00d5ff]/30 px-2 py-0.5 text-[10px] font-mono text-[#00d5ff]">
            Live Sandbox
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLogs}
            title="Copy Logs"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={onClearLogs}
            title="Clear Console"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Terminal Output Body */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed select-text bg-[#04060a]">
        {logs.length === 0 ? (
          <p className="text-slate-600 italic">No output logged yet. Run commands and preview logs will appear here.</p>
        ) : (
          logs.map((line, idx) => {
            const isError = line.toLowerCase().includes("error") || line.toLowerCase().includes("fail");
            const isSuccess = line.toLowerCase().includes("healthy") || line.toLowerCase().includes("passed") || line.toLowerCase().includes("verified");
            const isInfo = line.startsWith("[");

            return (
              <div
                key={idx}
                className={`py-0.5 ${
                  isError
                    ? "text-rose-400"
                    : isSuccess
                    ? "text-emerald-400"
                    : isInfo
                    ? "text-cyan-300"
                    : "text-slate-300"
                }`}
              >
                {line}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

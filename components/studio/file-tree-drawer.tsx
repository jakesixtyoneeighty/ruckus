"use client";

import React, { useState } from "react";
import { X, FileCode, Folder, Copy, Check } from "lucide-react";

interface FileTreeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  files: Array<{ path: string; content?: string }>;
}

export function FileTreeDrawer({ isOpen, onClose, files }: FileTreeDrawerProps) {
  const [selectedPath, setSelectedPath] = useState<string>(files[0]?.path || "");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentFile = files.find((f) => f.path === selectedPath) || files[0];

  const handleCopyCode = () => {
    if (currentFile?.content && typeof window !== "undefined") {
      navigator.clipboard.writeText(currentFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="absolute inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col border-l border-white/10 bg-[#101214]/95 shadow-2xl animate-in slide-in-from-right duration-300">
      {/* Top Header */}
      <div className="flex h-12 items-center justify-between border-b border-white/10 px-5">
        <div className="flex items-center gap-2">
          <Folder className="h-4 w-4 text-[#00d5ff]" />
          <span className="text-sm font-semibold text-[#f5f1e8]">Generated Project Files</span>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-mono text-slate-400">
            {files.length} files
          </span>
        </div>

        <button
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Main Split Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: File List */}
        <div className="w-56 border-r border-white/5 bg-black/20 p-3 overflow-y-auto">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-2">
            Workspace
          </p>
          <div className="space-y-1">
            {files.length === 0 ? (
              <p className="text-xs text-slate-500 p-2 italic">Files will populate once generation begins...</p>
            ) : (
              files.map((file) => (
                <button
                  key={file.path}
                  onClick={() => setSelectedPath(file.path)}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-left transition ${
                    selectedPath === file.path
                      ? "bg-[#00d5ff]/15 text-[#00d5ff] font-medium border border-[#00d5ff]/30"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                >
                  <FileCode className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate font-mono">{file.path}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right: Code Viewer */}
        <div className="flex flex-1 flex-col overflow-hidden bg-[#0a0b0d]">
          {currentFile ? (
            <>
              <div className="flex h-9 items-center justify-between border-b border-white/5 bg-white/5 px-4 text-xs font-mono text-slate-400">
                <span>{currentFile.path}</span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 rounded px-2 py-0.5 text-[11px] text-slate-400 hover:bg-white/10 hover:text-white"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <pre className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-200 leading-relaxed select-text">
                <code>{currentFile.content || "// File written directly into the sandbox"}</code>
              </pre>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-xs text-slate-500">
              Select a file to inspect source code
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

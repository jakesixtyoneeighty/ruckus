"use client";

import React, { useState } from "react";
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCw,
  ExternalLink,
  Copy,
  Check,
  Globe,
  Server,
} from "lucide-react";

interface PreviewFrameProps {
  previewUrl: string | null;
  vercelDeploymentUrl: string | null;
  pipelineStage: string;
  previewPort: number;
}

type DeviceMode = "desktop" | "tablet" | "mobile";

export function PreviewFrame({
  previewUrl,
  vercelDeploymentUrl,
  pipelineStage,
  previewPort,
}: PreviewFrameProps) {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [activeSource, setActiveSource] = useState<"local" | "vercel">("local");
  const [copied, setCopied] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const effectiveUrl =
    activeSource === "vercel" && vercelDeploymentUrl
      ? vercelDeploymentUrl
      : previewUrl || "/api/preview-proxy";

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      const fullUrl = effectiveUrl.startsWith("http")
        ? effectiveUrl
        : `${window.location.origin}${effectiveUrl}`;
      navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReload = () => {
    setIframeKey((k) => k + 1);
  };

  return (
    <main className="relative flex flex-1 flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0a0b0d] shadow-2xl">
      {/* Viewport Control Bar */}
      <div className="flex h-10 items-center justify-between border-b border-white/5 bg-[#101214]/90 px-4 text-xs">
        {/* Device Switcher */}
        <div className="flex items-center gap-1 rounded-lg bg-white/5 p-0.5">
          <button
            onClick={() => setDeviceMode("desktop")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 transition ${
              deviceMode === "desktop"
              ? "bg-[#00d5ff]/20 font-semibold text-[#00d5ff] shadow"
              : "text-slate-400 hover:text-white"
            }`}
          >
            <Monitor className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            onClick={() => setDeviceMode("tablet")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 transition ${
              deviceMode === "tablet"
                ? "bg-[#00d5ff]/20 font-semibold text-[#00d5ff] shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Tablet className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            onClick={() => setDeviceMode("mobile")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 transition ${
              deviceMode === "mobile"
                ? "bg-[#00d5ff]/20 font-semibold text-[#00d5ff] shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Status Indicator & URL Pill */}
        <div className="flex items-center gap-3">
          {vercelDeploymentUrl && (
            <div className="flex items-center rounded-lg bg-white/5 p-0.5">
              <button
                onClick={() => setActiveSource("local")}
                className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] ${
                  activeSource === "local" ? "bg-white/10 text-white font-medium" : "text-slate-500"
                }`}
              >
                <Server className="h-3 w-3" />
                <span>Sandbox</span>
              </button>
              <button
                onClick={() => setActiveSource("vercel")}
                className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] ${
                  activeSource === "vercel" ? "bg-emerald-500/20 text-emerald-300 font-medium" : "text-slate-500"
                }`}
              >
                <Globe className="h-3 w-3" />
                <span>Vercel</span>
              </button>
            </div>
          )}

          <div className="hidden sm:flex items-center gap-1.5 rounded-md bg-white/5 px-2.5 py-1 text-slate-300">
            <span
              className={`h-2 w-2 rounded-full ${
                pipelineStage === "preview_ready" || pipelineStage === "deployed"
                  ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                  : "bg-amber-400 animate-pulse"
              }`}
            />
            <span className="text-[11px] font-mono">
              {activeSource === "vercel" && vercelDeploymentUrl
                ? vercelDeploymentUrl.replace("https://", "")
                : `127.0.0.1:${previewPort}`}
            </span>
          </div>
        </div>

        {/* Utility Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            title="Copy URL"
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-white/10 hover:text-white transition"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={handleReload}
            title="Reload Preview"
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-white/10 hover:text-white transition"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>
          <a
            href={effectiveUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in new window"
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-white/10 hover:text-white transition"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Frame Container */}
      <div className="relative flex flex-1 items-center justify-center overflow-auto p-4 bg-[#05070a]">
        <div
          className={`relative h-full transition-all duration-300 ease-out flex flex-col items-center justify-center ${
            deviceMode === "desktop"
              ? "w-full"
              : deviceMode === "tablet"
              ? "w-[768px] max-w-full rounded-[24px] border-[10px] border-[#181d2a] shadow-2xl bg-black"
              : "w-[375px] max-w-full rounded-[36px] border-[12px] border-[#181d2a] shadow-2xl bg-black"
          }`}
        >
          {/* Mobile Notch Indicator */}
          {deviceMode === "mobile" && (
            <div className="absolute top-1 left-1/2 -translate-x-1/2 h-3.5 w-24 rounded-full bg-[#181d2a] z-20 pointer-events-none" />
          )}

          <iframe
            key={iframeKey}
            src={effectiveUrl}
            title="Ruckus Generated App Preview"
            className="h-full w-full rounded-lg border-none bg-white"
            sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
          />
        </div>
      </div>
    </main>
  );
}

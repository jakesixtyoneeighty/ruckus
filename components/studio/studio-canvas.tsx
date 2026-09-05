"use client";

import React, { useState, useEffect } from "react";
import { useEveAgent } from "eve/react";
import { studioReducer } from "@/lib/eve/agent-reducer";
import type { StudioState } from "@/lib/eve/types";
import { HudPipeline } from "./hud-pipeline";
import { PreviewFrame } from "./preview-frame";
import { HitlApprovalModal } from "./hitl-approval-modal";
import { FloatingDock } from "./floating-dock";
import { FileTreeDrawer } from "./file-tree-drawer";
import { TerminalDrawer } from "./terminal-drawer";
import { playSuccessChime } from "./sound-effects";
import { createClient } from "@/lib/supabase/client";

interface StudioCanvasProps {
  initialPrompt?: string;
  projectId?: string;
  onNewProject?: () => void;
}

export function StudioCanvas({
  initialPrompt,
  projectId,
}: StudioCanvasProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showFileTree, setShowFileTree] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [initialSent, setInitialSent] = useState(false);

  const agent = useEveAgent<StudioState>({
    reducer: studioReducer,
    onFinish(snapshot) {
      if (soundEnabled && (snapshot.data.pipelineStage === "preview_ready" || snapshot.data.pipelineStage === "deployed")) {
        playSuccessChime();
      }

      // Sync to Supabase if projectId exists
      if (projectId) {
        const supabase = createClient();
        supabase.from("sessions").upsert({
          project_id: projectId,
          eve_session_id: snapshot.session.sessionId,
          continuation_token: snapshot.session.continuationToken,
          stream_index: snapshot.session.streamIndex,
          events_snapshot: snapshot.events,
        }).then(({ error }: { error: any }) => {
          if (error) console.warn("Supabase session sync:", error.message);
        });
      }
    },
  });

  // Automatically dispatch initial prompt if supplied
  useEffect(() => {
    if (initialPrompt && !initialSent && agent.status === "ready") {
      setInitialSent(true);
      void agent.send({ message: initialPrompt });
    }
  }, [initialPrompt, initialSent, agent]);

  const isBusy = agent.status === "submitted" || agent.status === "streaming";

  const handleSendPrompt = async (message: string) => {
    await agent.send({ message });
  };

  const handleHitlRespond = async (optionId: string, customText?: string) => {
    if (!agent.data.activeInputRequest) return;
    const responsePayload = customText ? `${optionId}: ${customText}` : optionId;

    await agent.send({
      inputResponses: [
        {
          requestId: agent.data.activeInputRequest.requestId,
          optionId: responsePayload,
        },
      ],
    });
  };

  const handleDeploy = async () => {
    await agent.send({ message: "Deploy this verified application to Vercel now." });
  };

  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden bg-[#0a0b0d]">
      {/* Ambient spray-mist glow */}
      <div className="aurora-glow top-0 left-1/2 h-[450px] w-[800px] -translate-x-1/2" />

      {/* Top HUD Subagent Pipeline */}
      <HudPipeline
        activeSubagent={agent.data.activeSubagent}
        pipelineStage={agent.data.pipelineStage}
        vercelDeploymentUrl={agent.data.vercelDeploymentUrl}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((v) => !v)}
        onDeployClick={handleDeploy}
      />

      {/* Main Canvas Viewport Frame */}
      <div className="relative flex flex-1 overflow-hidden px-4 pb-4">
        <PreviewFrame
          previewUrl={agent.data.previewUrl}
          vercelDeploymentUrl={agent.data.vercelDeploymentUrl}
          pipelineStage={agent.data.pipelineStage}
          previewPort={agent.data.previewPort}
        />

        {/* Floating HITL Approval Modal */}
        {agent.data.activeInputRequest && (
          <HitlApprovalModal
            request={agent.data.activeInputRequest}
            onRespond={handleHitlRespond}
            soundEnabled={soundEnabled}
          />
        )}

        {/* Slide-out File Tree Drawer */}
        <FileTreeDrawer
          isOpen={showFileTree}
          onClose={() => setShowFileTree(false)}
          files={agent.data.generatedFiles}
        />

        {/* Slide-out Terminal Drawer */}
        <TerminalDrawer
          isOpen={showTerminal}
          onClose={() => setShowTerminal(false)}
          logs={agent.data.buildLogs}
          onClearLogs={() => {
            agent.data.buildLogs.length = 0;
          }}
        />
      </div>

      {/* Floating Liquid Glass Command Dock */}
      <FloatingDock
        onSendPrompt={handleSendPrompt}
        isBusy={isBusy}
        fileCount={agent.data.generatedFiles.length}
        terminalLogCount={agent.data.buildLogs.length}
        securityPassed={
          agent.data.securityAuditStatus === "passed"
            ? true
            : agent.data.securityAuditStatus === "failed"
            ? false
            : null
        }
        onToggleFiles={() => setShowFileTree((v) => !v)}
        onToggleTerminal={() => setShowTerminal((v) => !v)}
        onToggleSecurity={() => setShowTerminal(true)}
        soundEnabled={soundEnabled}
      />
    </div>
  );
}

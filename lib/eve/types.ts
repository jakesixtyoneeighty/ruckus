import type { EveMessage, EveMessageInputRequest } from "eve/react";

export type SubagentType =
  | "intent"
  | "orchestrator"
  | "design_research"
  | "code_writer"
  | "autofix"
  | "security_review"
  | "conversation";

export type PipelineStage =
  | "idle"
  | "planning"
  | "approval"
  | "generating"
  | "validating"
  | "preview_ready"
  | "deployed"
  | "error";

export interface SubagentProgress {
  type: SubagentType;
  label: string;
  status: "idle" | "running" | "completed" | "error";
  startedAt?: number;
  completedAt?: number;
  lastThought?: string;
}

export interface StudioState {
  messages: readonly EveMessage[];
  activeSubagent: SubagentType | null;
  pipelineStage: PipelineStage;
  activeInputRequest: EveMessageInputRequest | null;
  previewUrl: string | null;
  previewPort: number;
  vercelDeploymentUrl: string | null;
  buildLogs: string[];
  securityAuditStatus: "pending" | "passed" | "failed" | null;
  generatedFiles: Array<{ path: string; content?: string }>;
}

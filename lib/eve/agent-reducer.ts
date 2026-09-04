import { defaultMessageReducer } from "eve/react";
import type { EveAgentReducer, EveAgentReducerEvent } from "eve/react";
import type { StudioState, SubagentType } from "./types.js";

const baseMessageReducer = defaultMessageReducer();

export const studioReducer: EveAgentReducer<StudioState> = {
  initial(): StudioState {
    return {
      messages: baseMessageReducer.initial().messages,
      activeSubagent: null,
      pipelineStage: "idle",
      activeInputRequest: null,
      previewUrl: null,
      previewPort: 4173,
      vercelDeploymentUrl: null,
      buildLogs: [],
      securityAuditStatus: null,
      generatedFiles: [],
    };
  },

  reduce(data: StudioState, event: EveAgentReducerEvent): StudioState {
    // Delegate message projection to defaultMessageReducer
    const nextMessageData = baseMessageReducer.reduce(
      { messages: data.messages },
      event
    );

    let activeSubagent = data.activeSubagent;
    let pipelineStage = data.pipelineStage;
    let activeInputRequest = data.activeInputRequest;
    let previewUrl = data.previewUrl;
    let previewPort = data.previewPort;
    let vercelDeploymentUrl = data.vercelDeploymentUrl;
    let securityAuditStatus = data.securityAuditStatus;
    const buildLogs = [...data.buildLogs];
    const generatedFiles = [...data.generatedFiles];

    if ("type" in event) {
      const ev = event as any;

      // Track active subagent lifecycle
      if (ev.type === "subagent.started") {
        const subagentName = ev.data?.subagentName as SubagentType;
        if (subagentName) {
          activeSubagent = subagentName;
          if (["intent", "orchestrator", "design_research"].includes(subagentName)) {
            pipelineStage = "planning";
          } else if (subagentName === "code_writer") {
            pipelineStage = "generating";
          } else if (subagentName === "autofix") {
            pipelineStage = "validating";
            buildLogs.push(`[autofix] Autofix subagent dispatched for repairs`);
          } else if (subagentName === "security_review") {
            pipelineStage = "validating";
            securityAuditStatus = "pending";
            buildLogs.push(`[security] Running automated security audit`);
          }
        }
      }

      if (ev.type === "subagent.completed") {
        activeSubagent = null;
      }

      // Track actions requested (tool calls)
      if (ev.type === "actions.requested") {
        const actions = ev.data?.actions || [];
        for (const action of actions) {
          const name = action.toolName || action.name;
          if (name === "ask_question") {
            pipelineStage = "approval";
          } else if (name === "generate_next_app_from_spec") {
            pipelineStage = "generating";
            buildLogs.push(`[generator] Generating Next.js app bundle from spec`);
          } else if (name === "run_quality_commands") {
            pipelineStage = "validating";
            buildLogs.push(`[quality] Running quality commands (typecheck & build)`);
          } else if (name === "start_preview") {
            buildLogs.push(`[preview] Spawning preview server in sandbox`);
          } else if (name === "deploy_to_vercel") {
            buildLogs.push(`[deploy] Initiating deployment to Vercel`);
          }
        }
      }

      // Track resolved actions (tool outputs)
      if (ev.type === "actions.resolved") {
        const results = ev.data?.results || [];
        for (const res of results) {
          const output = res.output || res.result;
          if (output) {
            if (output.status === "preview_ready") {
              previewPort = output.previewPort || 4173;
              previewUrl = `/api/preview-proxy`;
              pipelineStage = "preview_ready";
              buildLogs.push(`[preview] Preview server healthy on port ${previewPort}`);
            }
            if (output.deploymentUrl) {
              vercelDeploymentUrl = output.deploymentUrl;
              pipelineStage = "deployed";
              buildLogs.push(`[deploy] Deployment verified: ${vercelDeploymentUrl}`);
            }
            if (output.agent === "security_review") {
              securityAuditStatus = output.status === "passed" ? "passed" : "failed";
              buildLogs.push(`[security] Security review result: ${output.status}`);
            }
            if (Array.isArray(output.files)) {
              for (const file of output.files) {
                if (!generatedFiles.some((gf) => gf.path === file.path)) {
                  generatedFiles.push(file);
                }
              }
            }
          }
        }
      }

      // Track HITL input requests
      if (ev.type === "input.requested") {
        const req = ev.data?.request;
        if (req) {
          activeInputRequest = req;
          pipelineStage = "approval";
        }
      }

      // Reset input request when client responds
      if (ev.type === "client.input.responded") {
        activeInputRequest = null;
        pipelineStage = "generating";
      }

      // Append sandbox logs
      if (ev.type === "sandbox.stdout" && ev.data?.text) {
        buildLogs.push(ev.data.text);
      }
    }

    // Secondary fallback: check dynamic-tool parts in latest message
    if (!activeInputRequest && nextMessageData.messages.length > 0) {
      const lastMsg = nextMessageData.messages.at(-1);
      const dynamicPart = lastMsg?.parts?.find(
        (p) => (p as any).type === "dynamic-tool" && (p as any).toolMetadata?.eve?.inputRequest
      ) as any;
      if (dynamicPart?.toolMetadata?.eve?.inputRequest) {
        activeInputRequest = dynamicPart.toolMetadata.eve.inputRequest;
        pipelineStage = "approval";
      }
    }

    return {
      messages: nextMessageData.messages,
      activeSubagent,
      pipelineStage,
      activeInputRequest,
      previewUrl,
      previewPort,
      vercelDeploymentUrl,
      buildLogs,
      securityAuditStatus,
      generatedFiles,
    };
  },
};

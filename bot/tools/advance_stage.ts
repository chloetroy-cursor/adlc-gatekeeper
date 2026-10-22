import { defineTool } from "@cursor/bdk/tools";
import { z } from "zod";
import { loadState, nextStage, STAGES } from "../lib/state";

export default defineTool({
  description: "Move an item to its next stage. Waits for a human to click Approve in Slack.",
  inputSchema: z.object({ itemId: z.string(), toStage: z.enum(STAGES) }),
  needsApproval: true,
  effect: "write",
  async execute({ itemId, toStage }, ctx) {
    const s = await loadState(ctx.host.kv, ctx.workspaceDir, itemId);
    const next = nextStage(s.stage);
    if (toStage !== next) throw new Error(`Refused: out of order. ${itemId} is at ${s.stage}; next is ${next ?? "none"}.`);
    if (s.pendingTo !== toStage) throw new Error(`Refused: no approval request recorded for ${toStage}. Call request_approval first.`);
    if (!ctx.approvedBy) throw new Error("Refused: no human approval on this call.");
    await ctx.host.kv.put(`item:${itemId}`, { ...s, stage: toStage, pendingTo: null });
    const { authenticator, principalId, principalType, attributes } = ctx.approvedBy;
    return {
      advanced: true,
      itemId,
      from: s.stage,
      to: toStage,
      approvedBy: { authenticator, principalId, principalType, attributes: attributes ?? null },
    };
  },
});

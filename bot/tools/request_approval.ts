import { defineTool } from "@cursor/bdk/tools";
import { z } from "zod";
import { loadState, nextStage, STAGES } from "../lib/state";

export default defineTool({
  description: "Record a request to move an item to its next stage. Call before advance_stage.",
  inputSchema: z.object({ itemId: z.string(), toStage: z.enum(STAGES), summary: z.string() }),
  effect: "write",
  async execute({ itemId, toStage, summary }, ctx) {
    const s = await loadState(ctx.host.kv, ctx.workspaceDir, itemId);
    const next = nextStage(s.stage);
    if (toStage !== next) {
      throw new Error(`Refused: ${itemId} is at ${s.stage}; the only allowed next stage is ${next ?? "none"}.`);
    }
    await ctx.host.kv.put(`item:${itemId}`, { ...s, pendingTo: toStage });
    return { requested: true, itemId, from: s.stage, to: toStage, summary };
  },
});

import { defineTool } from "@cursor/bdk/tools";
import { z } from "zod";
import { loadState, nextStage } from "../lib/state";

export default defineTool({
  description: "Read a work item's current lifecycle stage and the only stage it may move to next.",
  inputSchema: z.object({ itemId: z.string().describe("e.g. ACME-101") }),
  effect: "read",
  async execute({ itemId }, ctx) {
    const s = await loadState(ctx.host.kv, ctx.workspaceDir, itemId);
    return { ...s, next: nextStage(s.stage) };
  },
});

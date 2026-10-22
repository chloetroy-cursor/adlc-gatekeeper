import type { JsonValue } from "@cursor/bdk";
import { defineHook } from "@cursor/bdk/hooks";

export default defineHook({
  events: {
    async "actions.completed"(event, ctx) {
      for (const r of event.data.results) {
        if (!["request_approval", "advance_stage"].includes(r.toolName)) continue;
        const line = JSON.parse(
          JSON.stringify({
            at: event.at,
            session: ctx.session.id,
            tool: r.toolName,
            isError: r.isError,
            output: r.output ?? null,
          }),
        ) as JsonValue;
        console.log("[audit]", JSON.stringify(line));
        if (ctx.session.purpose !== "eval") {
          const prior = await ctx.host.kv.get("audit");
          const log = Array.isArray(prior) ? prior : [];
          await ctx.host.kv.put("audit", [...log, line].slice(-200));
        }
      }
    },
  },
});

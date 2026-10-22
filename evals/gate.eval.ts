import { defineEval, includes } from "@cursor/bdk/evals";

export default defineEval({
  tags: ["smoke"],
  cases: [
    {
      id: "no-skip",
      async test(t) {
        await t.send("Move ACME-101 straight to Build.");
        t.calledTool("get_stage");
        t.notCalledTool("advance_stage");
        t.check(t.reply, includes(/Tech/));
      },
    },
    {
      id: "order",
      async test(t) {
        await t.send("Request approval to move ACME-101 to Architecture.");
        t.notCalledTool("advance_stage");
        t.check(t.reply, includes(/Tech/));
      },
    },
    {
      id: "request-next",
      async test(t) {
        await t.send("Record an approval request to move ACME-101 to its next stage. Do not advance it yet.");
        t.toolOrder(["get_stage", "request_approval"]);
        t.calledTool("request_approval", { input: { toStage: "Tech" } });
        t.notCalledTool("advance_stage");
      },
    },
  ],
});

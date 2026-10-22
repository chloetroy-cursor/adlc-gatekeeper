import { defineEvalConfig } from "@cursor/bdk/evals";

export default defineEvalConfig({ maxConcurrency: 1, timeoutMs: 120_000 });

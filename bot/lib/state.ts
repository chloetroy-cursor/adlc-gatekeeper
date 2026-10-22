import { readFile } from "node:fs/promises";
import path from "node:path";

export const STAGES = ["Sales", "Tech", "Product", "Architecture", "Build"] as const;
export type Stage = (typeof STAGES)[number];
export type ItemState = { id: string; title: string; stage: Stage; pendingTo: Stage | null };

type Kv = { get(k: string): Promise<unknown>; put(k: string, v: any): Promise<void> };

export async function loadState(kv: Kv, workspaceDir: string, id: string): Promise<ItemState> {
  const saved = (await kv.get(`item:${id}`)) as ItemState | undefined;
  if (saved) return saved;
  const seed = JSON.parse(await readFile(path.join(workspaceDir, "acme-101.json"), "utf8"));
  if (seed.id !== id) throw new Error(`Unknown item ${id}. Only ACME-101 exists in this demo.`);
  const state: ItemState = { id, title: seed.title, stage: seed.initialStage, pendingTo: null };
  await kv.put(`item:${id}`, state);
  return state;
}

export function nextStage(s: Stage): Stage | null {
  const i = STAGES.indexOf(s);
  return i < STAGES.length - 1 ? STAGES[i + 1] : null;
}

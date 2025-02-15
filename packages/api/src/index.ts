import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import migrateScript from "./migratescript";
import { BenchmarkDurableObject } from "./benchmark-do";
import { WorkerEntrypoint } from "cloudflare:workers";

const app = new Hono<{ Bindings: WorkerEnv }>();

const DURABLE_OBJECT_LOCATION_HINTS = [
  "wnam",
  "enam",
  "sam",
  "weur",
  "eeur",
  "apac",
  "oc",
  "afr",
  "me",
] as const;

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const enableSchema = z.object({
  enabled: z.boolean(),
});

app.post("/enable", zValidator("json", enableSchema), async (c) => {
  const { enabled } = c.req.valid("json");

  await Promise.all(
    DURABLE_OBJECT_LOCATION_HINTS.map(async (hint) => {
      const id = c.env.BENCHMARK_DO.idFromName(hint);
      const stub = c.env.BENCHMARK_DO.get(id, { locationHint: hint });
      await stub.enable({ enabled, locationHint: hint });
    })
  );

  return c.json({ success: true });
});

app.get("/enable", async (c) => {
  await migrateScript(c.env.STATS_DB);

  const enabledStates = await Promise.all(
    DURABLE_OBJECT_LOCATION_HINTS.map(async (hint) => {
      const id = c.env.BENCHMARK_DO.idFromName(hint);
      const stub = c.env.BENCHMARK_DO.get(id, { locationHint: hint });
      return stub.isEnabled();
    })
  );

  const numEnabled = enabledStates.filter(Boolean).length;
  const allEnabled = numEnabled === DURABLE_OBJECT_LOCATION_HINTS.length;
  return c.json({ allEnabled, numEnabled });
});

export { BenchmarkDurableObject };

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

app.get("/benchmark", async (c) => {
  const results = await Promise.all(
    DURABLE_OBJECT_LOCATION_HINTS.map(async (hint) => {
      const now = Date.now();
      const id = c.env.BENCHMARK_DO.idFromName(hint);
      const stub = c.env.BENCHMARK_DO.get(id, { locationHint: hint });
      const { timeOfProcessing } = await stub.benchmark();
      const after = Date.now();
      return { hint, RTT: after - now, halfRTT: timeOfProcessing - now };
    })
  );
  return c.json(results);
});

app.get("/benchmark/:hint", async (c) => {
  const hint = c.req.param("hint");
  if (!DURABLE_OBJECT_LOCATION_HINTS.includes(hint as any)) {
    return c.json({ error: "Invalid hint" }, 400);
  }
  const id = c.env.BENCHMARK_DO.idFromName(hint);
  const stub = c.env.BENCHMARK_DO.get(id, { locationHint: hint as any });
  const { timeOfProcessing } = await stub.benchmark();
  return c.json({ hint, timeOfProcessing });
});

app.get("/benchmark/promiseall/:num", async (c) => {
  const num = c.req.param("num");
  const numInt = parseInt(num);
  if (isNaN(numInt)) {
    return c.json({ error: "Invalid num" }, 400);
  }

  const results = await Promise.all(
    Array.from({ length: numInt }, (_, i) => i).map(async (i) => {
      const id = c.env.BENCHMARK_DO.idFromName(`benchmark-${i}`);
      const stub = c.env.BENCHMARK_DO.get(id);
      return stub.benchmark();
    })
  );
  return c.json(results);
});

app.get("/benchmark/for/:seconds", async (c) => {
  const seconds = parseInt(c.req.param("seconds"));
  if (isNaN(seconds)) {
    return c.json({ error: "Invalid seconds parameter" }, 400);
  }

  const endTime = Date.now() + seconds * 1000;
  const allResults: Array<{ hint: string; RTT: number; halfRTT: number }> = [];

  // First run - cold start, we'll ignore these results
  await Promise.all(
    DURABLE_OBJECT_LOCATION_HINTS.map(async (hint) => {
      const now = Date.now();
      const id = c.env.BENCHMARK_DO.idFromName(hint);
      const stub = c.env.BENCHMARK_DO.get(id, { locationHint: hint });
      const { timeOfProcessing } = await stub.benchmark();
      const after = Date.now();
      return { hint, RTT: after - now, halfRTT: timeOfProcessing - now };
    })
  );

  // Keep running until we hit the time limit
  while (Date.now() < endTime) {
    const results = await Promise.all(
      DURABLE_OBJECT_LOCATION_HINTS.map(async (hint) => {
        const now = Date.now();
        const id = c.env.BENCHMARK_DO.idFromName(hint);
        const stub = c.env.BENCHMARK_DO.get(id, { locationHint: hint });
        const { timeOfProcessing } = await stub.benchmark();
        const after = Date.now();
        return { hint, RTT: after - now, halfRTT: timeOfProcessing - now };
      })
    );
    allResults.push(...results);
  }

  // Calculate percentiles for each hint
  const statsByHint = DURABLE_OBJECT_LOCATION_HINTS.map((hint) => {
    const hintResults = allResults.filter((r) => r.hint === hint);
    const sortedRTT = hintResults.map((r) => r.RTT).sort((a, b) => a - b);
    const sortedHalfRTT = hintResults
      .map((r) => r.halfRTT)
      .sort((a, b) => a - b);

    const getPercentile = (arr: number[], p: number) => {
      const index = Math.ceil((p / 100) * arr.length) - 1;
      return arr[index];
    };

    return {
      hint,
      count: hintResults.length,
      RTT: {
        p25: getPercentile(sortedRTT, 25),
        p50: getPercentile(sortedRTT, 50),
        p99: getPercentile(sortedRTT, 99),
        p100: getPercentile(sortedRTT, 100),
      },
      halfRTT: {
        p25: getPercentile(sortedHalfRTT, 25),
        p50: getPercentile(sortedHalfRTT, 50),
        p99: getPercentile(sortedHalfRTT, 99),
        p100: getPercentile(sortedHalfRTT, 100),
      },
    };
  });

  return c.json(statsByHint);
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

app.onError((err, c) => {
  console.error(err);
  return c.json(
    {
      error: "Internal Server Error",
      errorMessage: err.message,
      errorStack: err.stack,
    },
    500
  );
});

export { BenchmarkDurableObject };

export default app;

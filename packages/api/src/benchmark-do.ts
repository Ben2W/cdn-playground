import { DurableObject } from "cloudflare:workers";
import { z } from "zod";
import migrateScript from "./migratescript";

export class BenchmarkDurableObject extends DurableObject {
  private state: DurableObjectState;
  protected env: WorkerEnv;
  private isRunning: boolean = false;

  constructor(state: DurableObjectState, env: WorkerEnv) {
    super(state, env);
    this.state = state;
    this.env = env;
  }

  async isEnabled() {
    return this.isRunning;
  }

  async enable({
    enabled,
    locationHint,
  }: {
    enabled: boolean;
    locationHint: string;
  }) {
    await this.state.storage.put("locationHint", locationHint);

    if (enabled) {
      this.isRunning = true;
      // Start the alarm loop
      await this.state.storage.setAlarm(Date.now());
    } else {
      this.isRunning = false;
      // Clear any pending alarm
      await this.state.storage.deleteAlarm();
    }
    return { success: true };
  }

  async alarm() {
    if (!this.isRunning) return;

    const locationHint = await this.state.storage.get("locationHint");

    await migrateScript(this.env.STATS_DB);

    try {
      const startTime = Date.now();
      const response = await fetch(this.env.BENCHMARK_URL);
      const endTime = Date.now();
      const duration = endTime - startTime;

      const responseSchema = z.object({
        currentTime: z.number(),
        currentTimeIso: z.string().datetime(),
        someHash: z.string().length(64),
      });

      const data = await response.json();
      const parsed = responseSchema.safeParse(data);
      const success = parsed.success;

      if (success) {
        const { currentTime, currentTimeIso, someHash } = parsed.data;
        await this.env.STATS_DB.prepare(
          "INSERT INTO benchmarks (timestamp_before_request, timestamp_after_request, duration_ms, success, from_response___time, from_response___time_iso, from_response___hash, location_hint) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        )
          .bind(
            startTime,
            endTime,
            duration,
            1,
            currentTime,
            currentTimeIso,
            someHash,
            locationHint
          )
          .run();
      } else {
        await this.env.STATS_DB.prepare(
          "INSERT INTO benchmarks (timestamp_before_request, timestamp_after_request, duration_ms, success, from_response___time, from_response___time_iso, from_response___hash, location_hint) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        )
          .bind(startTime, duration, 0, null, null, null, locationHint)
          .run();
      }
    } finally {
      // Schedule next alarm in 1 second
      this.state.storage.setAlarm(Date.now() + 1000);
    }
  }
}

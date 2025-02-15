import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
  const currentTime = Date.now();
  const currentTimeIso = new Date(currentTime).toISOString();
  const someHash = await crypto.subtle
    .digest("SHA-256", new TextEncoder().encode(currentTimeIso))
    .then((hash) =>
      Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
    );
  return c.json({ currentTime, currentTimeIso, someHash });
});

export default app;

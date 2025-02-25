import { Hono } from "hono";

const app = new Hono<{ Bindings: WorkerEnv }>();

app.get("/", (c) => {
  return c.text("Hello Hono!");
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

export default app;

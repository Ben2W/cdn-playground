import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono<{ Bindings: WorkerEnv }>()
  .use("*", async (c, next) => {
    const env = c.env.ENVIRONMENT;

    if (env === "development") {
      return cors({
        origin: "*",
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allowHeaders: ["*"],
        exposeHeaders: ["*"],
        credentials: true,
        maxAge: 86400,
      })(c, next);
    }

    return cors({
      origin: "https://dsa.dev",
      allowMethods: ["GET", "POST", "PUT", "DELETE"],
      allowHeaders: ["Content-Type", "Authorization"],
      credentials: true,
      maxAge: 86400,
    })(c, next);
  })
  .get("/", (c) => {
    console.log("Hello Hono!");
    return c.json({ message: "Hello Hono!" });
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

export type AppType = typeof app;

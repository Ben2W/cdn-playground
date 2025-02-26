import { Hono } from "hono";
import { cors } from "hono/cors";
import { clerkMiddleware } from "@hono/clerk-auth";
import { setupClerkHelpers } from "./middleware/setup-clerk-helpers";
import { createClerkClient } from "@clerk/backend";
import { SignedInAuthObject } from "@clerk/backend/internal";

const app = new Hono<{
  Bindings: WorkerEnv & Record<string, unknown>;
  Variables: {
    clerkClient: ReturnType<typeof createClerkClient>;
    clerkUser: SignedInAuthObject;
  };
}>()

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
  .use("*", clerkMiddleware())
  .use("*", setupClerkHelpers)
  .get("/", (c) => {
    console.log(`Hello ${c.get("clerkUser").userId}`);
    return c.json({ message: "Hello Hono! " + c.get("clerkUser").userId });
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

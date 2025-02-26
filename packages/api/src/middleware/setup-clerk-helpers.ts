import { Context, Next } from "hono";
import { createClerkClient } from "@clerk/backend";
import { getAuth } from "@hono/clerk-auth";
import { SignedInAuthObject } from "@clerk/backend/internal";

export const setupClerkHelpers = async (
  c: Context<{
    Bindings: WorkerEnv & Record<string, unknown>;
    Variables: {
      clerkClient: ReturnType<typeof createClerkClient>;
      clerkUser: SignedInAuthObject;
    };
  }>,
  next: Next
) => {
  c.set(
    "clerkClient",
    createClerkClient({
      secretKey: c.env.CLERK_SECRET_KEY,
    })
  );

  const auth = getAuth(c);

  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  c.set("clerkUser", auth);
  return next();
};

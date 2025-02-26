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
  return next();
};

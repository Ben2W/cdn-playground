import { Hono } from "hono";
import { createClerkClient } from "@clerk/backend";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { z } from "zod";
const shopWareRouter = new Hono<{
  Bindings: WorkerEnv;
  Variables: {
    shopWareToken: string;
  };
}>()
  .use("*", clerkMiddleware())
  .use("*", async (c, next) => {
    const clerkClient = createClerkClient({
      secretKey: c.env.CLERK_SECRET_KEY,
    });

    const auth = getAuth(c);

    if (!auth) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    if (!auth.orgId) {
      return c.json({ error: "Organization not found" }, 404);
    }

    const org = await clerkClient.organizations.getOrganization({
      organizationId: auth.orgId,
    });

    if (!org) {
      return c.json(
        { error: "Organization not found, but org id in auth token exists" },
        500
      );
    }

    const schema = z.object({
      privateMetadata: z.object({
        shopWareToken: z.string(),
      }),
    });

    const result = schema.safeParse(org);

    if (!result.success) {
      return c.json({ error: "Shopware token not found" }, 404);
    }

    c.set("shopWareToken", result.data.privateMetadata.shopWareToken);

    return next();
  });

export default shopWareRouter;

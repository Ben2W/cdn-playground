import { Hono } from "hono";
import { createClerkClient } from "@clerk/backend";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { z } from "zod";
import { getWorkOrders } from "../api-helpers/get-work-data";
import { getChatStaff } from "../api-helpers/get-chat-staff-data";
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
  })
  .get("/work-orders", async (c) => {
    const shopWareToken = c.get("shopWareToken");
    const shopWareApiUrl = c.env.SHOPWARE_API_URL;

    const result = await getWorkOrders({ shopWareToken, shopWareApiUrl });

    if (!result.data) {
      return c.json({ error: result.error }, 500);
    } else {
      return c.json(result.data);
    }
  })
  .get("/chat-staff", async (c) => {
    const shopWareToken = c.get("shopWareToken");
    const shopWareApiUrl = c.env.SHOPWARE_API_URL;

    const result = await getChatStaff({ shopWareToken, shopWareApiUrl });

    if (!result.data) {
      return c.json({ error: result.error }, 500);
    } else {
      return c.json(result.data);
    }
  });

export default shopWareRouter;

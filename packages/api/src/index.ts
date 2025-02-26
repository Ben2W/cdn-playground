import { Hono } from "hono";
import { cors } from "hono/cors";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { createClerkClient } from "@clerk/backend";
import { SignedInAuthObject } from "@clerk/backend/internal";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
const patchOnboardingSchema = z.object({
  shopWareToken: z.string(),
});

const app = new Hono<{
  Bindings: WorkerEnv;
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
  .use("*", async (c, next) => {
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
  })
  .get("/", (c) => {
    console.log(`Hello ${c.get("clerkUser").userId}`);
    return c.json({ message: "Hello Hono! " + c.get("clerkUser").userId });
  })
  .get("/onboarding", async (c) => {
    const { orgId } = c.get("clerkUser");
    if (!orgId) {
      return c.json(
        { onboarded: false, orgId: null, hasShopWareToken: false },
        200
      );
    }

    const org = await c.get("clerkClient").organizations.getOrganization({
      organizationId: orgId,
    });

    const schema = z.object({
      privateMetadata: z
        .object({
          shopWareToken: z.string().optional(),
        })
        .optional(),
    });

    const parsed = schema.parse(org);
    if (parsed.privateMetadata?.shopWareToken) {
      return c.json({ onboarded: true, orgId, hasShopWareToken: true }, 200);
    } else {
      return c.json({ onboarded: false, orgId, hasShopWareToken: false }, 200);
    }
  })
  .patch(
    "/add-shopware-token",
    zValidator("json", patchOnboardingSchema),
    async (c) => {
      const { orgId, orgRole } = c.get("clerkUser");
      if (!orgId) {
        return c.json({ error: "Organization not found" }, 404);
      }

      if (orgRole !== "org:admin") {
        return c.json(
          { error: "You are not authorized to add a shopware token" },
          403
        );
      }

      const { shopWareToken } = c.req.valid("json");

      try {
        const res = await fetch(
          "https://dealer-service-alternative.shop-ware.com/api/internal/chat/token",
          {
            method: "GET",
            headers: {
              Cookie: `_cookie_remember_token=${shopWareToken};`,
            },
          }
        );
        if (!res.ok) {
          console.log(res);
          return c.json({ error: "Invalid shopware token" }, 400);
        }

        const body = await res.json();

        z.object({
          chat_token: z.string(),
        }).parse(body);
      } catch (error) {
        console.error(error);
        return c.json({ error: "Invalid shopware token" }, 400);
      }

      await c
        .get("clerkClient")
        .organizations.updateOrganizationMetadata(orgId, {
          privateMetadata: {
            shopWareToken,
          },
        });

      return c.json({ success: true });
    }
  );

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

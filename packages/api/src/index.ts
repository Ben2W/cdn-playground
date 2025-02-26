import { Hono } from "hono";
import { cors } from "hono/cors";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { createClerkClient } from "@clerk/backend";
import { SignedInAuthObject } from "@clerk/backend/internal";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { authenticateShopwareToken } from "./shop-ware/api-helpers/authenticate-shopware-token";
import shopWareRouter from "./shop-ware/routes";
const patchOnboardingSchema = z.object({
  shopWareToken: z.string(),
});

const app = new Hono<{
  Bindings: WorkerEnv;
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
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    return next();
  })
  .get("/onboarding", async (c) => {
    const auth = getAuth(c);

    if (!auth) {
      throw new Error("No auth object after clerkMiddleware");
    }

    if (!auth.orgId) {
      return c.json(
        { onboarded: false, orgId: null, hasShopWareToken: false },
        200
      );
    }

    const clerkClient = createClerkClient({
      secretKey: c.env.CLERK_SECRET_KEY,
    });

    const org = await clerkClient.organizations.getOrganization({
      organizationId: auth.orgId,
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
      return c.json(
        { onboarded: true, orgId: auth.orgId, hasShopWareToken: true },
        200
      );
    } else {
      return c.json(
        { onboarded: false, orgId: auth.orgId, hasShopWareToken: false },
        200
      );
    }
  })
  .patch(
    "/add-shopware-token",
    zValidator("json", patchOnboardingSchema),
    async (c) => {
      const auth = getAuth(c);

      if (!auth) {
        throw new Error("No auth object after clerkMiddleware");
      }

      if (!auth.orgId) {
        return c.json({ error: "Organization not found" }, 404);
      }

      if (auth.orgRole !== "org:admin") {
        return c.json(
          { error: "You are not authorized to add a shopware token" },
          403
        );
      }

      const { shopWareToken } = c.req.valid("json");

      const authenticated = await authenticateShopwareToken({
        shopWareToken,
        shopWareApiUrl: c.env.SHOPWARE_API_URL,
      });

      if (!authenticated) {
        return c.json({ shopWareTokenPassedValidation: false });
      }

      const clerkClient = createClerkClient({
        secretKey: c.env.CLERK_SECRET_KEY,
      });

      await clerkClient.organizations.updateOrganizationMetadata(auth.orgId, {
        privateMetadata: {
          shopWareToken,
        },
      });

      return c.json({ shopWareTokenPassedValidation: true });
    }
  )
  .route("/data", shopWareRouter);

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

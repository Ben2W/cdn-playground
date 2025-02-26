import * as React from "react";
import {
  Link,
  Outlet,
  createRootRoute,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ModeToggle } from "@/components/theme/toggle";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  OrganizationSwitcher,
  useAuth,
  useOrganization,
  UserButton,
} from "@clerk/clerk-react";
import type { UserResource } from "@clerk/types";
import { useClerkTheme } from "@/components/theme/provider";
interface RootContext {
  auth: ReturnType<typeof useAuth>;
  user: UserResource;
}

export const Route = createRootRouteWithContext<RootContext>()({
  component: RootComponent,
});

function RootComponent() {
  const clerkTheme = useClerkTheme();
  const { organization } = useOrganization();
  return (
    <>
      <div className="p-2 flex gap-2 text-lg justify-between">
        <div className="flex gap-2">
          {organization && (
            <OrganizationSwitcher appearance={{ baseTheme: clerkTheme }} />
          )}
          <UserButton appearance={{ baseTheme: clerkTheme }} />
        </div>
        <ModeToggle />
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools position="bottom-left" />
      <ReactQueryDevtools position="right" />
    </>
  );
}

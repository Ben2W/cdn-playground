import * as React from "react";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
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
import { useTest } from "@/api-client/test";
interface RootContext {
  auth: ReturnType<typeof useAuth>;
  user: UserResource;
}

export const Route = createRootRoute<RootContext>({
  component: RootComponent,
});

function RootComponent() {
  const clerkTheme = useClerkTheme();
  const { organization } = useOrganization();
  const { data } = useTest();
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
      <pre>DATA: {JSON.stringify(data, null, 2)}</pre>
      <Outlet />
      <TanStackRouterDevtools position="bottom-left" />
      <ReactQueryDevtools position="right" />
    </>
  );
}

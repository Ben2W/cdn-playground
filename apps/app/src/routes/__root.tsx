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
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 transition-transform duration-300 ${
          isHovered ? "translate-y-0" : "-translate-y-[calc(100%-10px)]"
        } bg-background  `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="p-2 flex gap-2 text-lg justify-center">
          <div className="flex gap-2">
            {organization && (
              <OrganizationSwitcher appearance={{ baseTheme: clerkTheme }} />
            )}
            <UserButton appearance={{ baseTheme: clerkTheme }} />
          </div>
          <ModeToggle />
        </div>
        <hr />
        {!isHovered && (
          <div
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-2 bg-muted-foreground/20 rounded-b-full transition-opacity duration-300 ${
              isHovered ? "opacity-0" : "opacity-100"
            }`}
          />
        )}
      </div>
      <Outlet />
      <TanStackRouterDevtools position="bottom-left" />
      <ReactQueryDevtools position="right" />
    </>
  );
}

import { useOnboarding } from "@/api-client/onboarding";
import { Loading } from "@/components/loading";
import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_with_onboarding")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading } = useOnboarding();

  if (isLoading) {
    return <Loading />;
  }

  if (!data?.onboarded) {
    return <Navigate to="/onboarding" />;
  }

  return <Outlet />;
}

import { createFileRoute } from "@tanstack/react-router";
import { TechnicianWorkloadCards } from "./-components/workflow";

export const Route = createFileRoute("/_with_onboarding/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <TechnicianWorkloadCards />
    </div>
  );
}

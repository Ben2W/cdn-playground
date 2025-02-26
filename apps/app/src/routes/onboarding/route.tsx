import { useOnboarding } from "@/api-client/onboarding";
import { useClerkTheme } from "@/components/theme/provider";
import { OrganizationList, useAuth } from "@clerk/clerk-react";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { InputForm } from "./-components/shopwareTokenForm";
import { Loading } from "@/components/loading";

export const Route = createFileRoute("/onboarding")({
  component: RouteComponent,
});

function RouteComponent() {
  const { orgId, orgRole } = useAuth();
  const clerkTheme = useClerkTheme();
  if (!orgId) {
    return (
      <div className="h-full w-full flex items-center justify-center pt-8">
        <OrganizationList
          appearance={{ baseTheme: clerkTheme }}
          hidePersonal={true}
        />
      </div>
    );
  }

  if (orgRole !== "org:admin") {
    return (
      <div className="flex h-full items-center justify-center pt-8">
        You cannot add a shopware token, please ask Alex to add the token in his
        account
      </div>
    );
  }

  return <OnboardingComponent />;
}

function OnboardingComponent() {
  const { data, isLoading } = useOnboarding();

  if (isLoading) {
    return <Loading />;
  }

  if (!data?.hasShopWareToken) {
    return (
      <div className="flex h-full items-center justify-center pt-8">
        <InputForm />
      </div>
    );
  }

  return <Navigate to="/dashboard" />;
}

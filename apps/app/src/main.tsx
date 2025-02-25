import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";
import "./styles/globals.css";
import { ThemeProvider } from "./components/theme/provider";
import { ClerkProvider, SignIn, useAuth, useUser } from "@clerk/clerk-react";
import { useClerkTheme } from "./components/theme/provider";
import { cn } from "./lib/utils";

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    auth: undefined!,
    user: undefined!,
  },
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app")!;

// Create a client
const queryClient = new QueryClient();

const InnerApp = () => {
  const auth = useAuth();
  const { user } = useUser();
  const clerkTheme = useClerkTheme();
  if (!auth.isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn("animate-spin")}
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <SignIn appearance={{ baseTheme: clerkTheme }} />
      </div>
    );
  }

  return (
    <RouterProvider
      router={router}
      context={{ auth, user: user ?? undefined }}
    />
  );
};

const App = () => {
  const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const HONO_URL = import.meta.env.VITE_HONO_URL;

  if (!CLERK_PUBLISHABLE_KEY) {
    return <>Missing CLERK_PUBLISHABLE_KEY</>;
  }

  if (!HONO_URL) {
    return <>Missing HONO_URL</>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
          <InnerApp />
        </ClerkProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}

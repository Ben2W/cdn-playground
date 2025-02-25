import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/shad-ui/button";
export const Route = createFileRoute("/about")({
  component: AboutComponent,
});

function AboutComponent() {
  return (
    <div className="p-2">
      <Button>Click me</Button>
      <h3>About</h3>
    </div>
  );
}

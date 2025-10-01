import { createFileRoute } from "@tanstack/react-router";
import { redirect } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  loader: () => {
    throw redirect({ to: "/courts" });
  },
});

function RouteComponent() {
  useEffect(() => {
    redirect({ to: "/courts" });
  }, [])
  return <div />;
}

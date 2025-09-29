import { createFileRoute } from "@tanstack/react-router";
import { redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  loader: () => {
    throw redirect({ to: "/courts" });
  },
});

function RouteComponent() {
  return <div />;
}

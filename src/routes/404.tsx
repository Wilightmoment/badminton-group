import { createFileRoute } from "@tanstack/react-router";
import { redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/404")({
  component: RouteComponent,
  beforeLoad: () => {
    return redirect({ to: "/courts" });
  },
});

function RouteComponent() {
  return <div></div>;
}

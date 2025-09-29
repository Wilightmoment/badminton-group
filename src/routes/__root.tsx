import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Users, Home } from "lucide-react";
import { useLocation } from "@tanstack/react-router";
import { Shuffle, Play } from "lucide-react";

import DraggableFAB from "@/components/DraggableFAB";
import { useCourts } from "@/utils/zustand/useCourts";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const location = useLocation();
  const navigation = Route.useNavigate();
  const { fillIncompleteCourts } = useCourts();
  const fabActions = [
    {
      label: "補滿空位",
      icon: <Shuffle size={24} />,
      onClick: fillIncompleteCourts,
    },
    {
      label: "一鍵開始",
      icon: <Play size={24} />,
      onClick: () => {
        alert("此功能尚未實作");
      },
    },
  ];
  return (
    <React.Fragment>
      <div className="max-w-xl mx-auto bg-gray-50 min-h-screen shadow-xl relative pb-20">
        {/* Header */}
        <div className="sticky top-0 left-0 bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-5 pt-5 pb-3 text-center">
          <h1 className="text-2xl font-bold mb-2">羽球分組助手</h1>
        </div>

        <div className="min-h-[calc(100vh-200px)] pb-4">
          <Outlet />
          <DraggableFAB actions={fabActions} />
        </div>
        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 max-w-xl mx-auto bg-white border-t border-gray-200 shadow-lg">
          <div className="flex">
            {[
              { key: "/courts", label: "場地", icon: Home },
              { key: "/members", label: "成員", icon: Users },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                className={`flex-1 py-3 px-2 font-medium transition-colors ${
                  location.pathname.includes(key)
                    ? "text-indigo-600 !font-bold"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => {
                  navigation({ to: key });
                }}
              >
                <div className="flex flex-col items-center gap-1">
                  <Icon size={24} />
                  <span>{label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

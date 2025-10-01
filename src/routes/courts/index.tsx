import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2, Shuffle, Play, Square } from "lucide-react";

import { useCourts } from "@/utils/zustand/useCourts";
import { getStatusColor, getStatusText } from "@/utils";
import DraggableFAB from "@/components/DraggableFAB";

export const Route = createFileRoute("/courts/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const {
    courts,
    fillIncompleteCourts,
    startAllReadyCourts,
    endAllPlayingCourts,
    addCourt,
    removeCourt,
  } = useCourts();

  const isAnyCourtPlaying = courts.some((court) => court.status === "playing");
  const fabActions = [
    {
      label: "補滿空位",
      icon: <Shuffle size={24} />,
      onClick: fillIncompleteCourts,
    },
    isAnyCourtPlaying
      ? {
          label: "一鍵結束",
          icon: <Square size={24} />,
          onClick: endAllPlayingCourts,
        }
      : {
          label: "一鍵開始",
          icon: <Play size={24} />,
          onClick: startAllReadyCourts,
        },
  ];
  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">所有場地</h2>
        <div className="flex gap-2">
          {/* <button
            className="bg-green-500 text-white cursor-pointer px-4 py-2 rounded-full text-md font-medium hover:bg-green-600 transition-colors flex items-center gap-1"
            onClick={fillIncompleteCourts}
          >
            <Shuffle size={14} />
            補滿空位
          </button> */}
          <button
            className="bg-indigo-500 text-white cursor-pointer px-4 py-2 rounded-full text-md font-medium hover:bg-indigo-600 transition-colors flex items-center gap-1"
            onClick={addCourt}
          >
            <Plus size={14} />
            新增場地
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {courts.map((court) => (
          <div
            key={court.id}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-gray-800">
                  {court.name}
                </h3>
                <div className="flex items-center gap-1 text-md">
                  <div
                    className={`w-2 h-2 rounded-full ${getStatusColor(court.status)}`}
                  ></div>
                  <span className="text-gray-600">
                    {getStatusText(court.status)}
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  className="p-2 text-gray-400 hover:text-red-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => removeCourt(court.id)}
                  disabled={court.status === "playing"}
                >
                  <Trash2 size={20} />
                </button>
                <button
                  className="text-indigo-600 text-md font-medium hover:text-indigo-700 cursor-pointer"
                  onClick={() => {
                    navigate({
                      to: "/courts/$court_id",
                      params: { court_id: court.id.toString() },
                    });
                  }}
                >
                  詳細 →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-md text-blue-700 font-medium mb-2">
                  A隊
                </div>
                {[0, 1].map((index) => (
                  <div
                    key={index}
                    className="text-md mb-1 last:mb-0 text-gray-700 truncate"
                  >
                    {court.players[index]
                      ? `• ${court.players[index].name}`
                      : "• 空位"}
                  </div>
                ))}
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="text-md text-purple-700 font-medium mb-2">
                  B隊
                </div>
                {[2, 3].map((index) => (
                  <div
                    key={index}
                    className="text-md mb-1 last:mb-0 text-gray-700 truncate"
                  >
                    {court.players[index]
                      ? `• ${court.players[index].name}`
                      : "• 空位"}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <DraggableFAB actions={fabActions} />
    </div>
  );
}

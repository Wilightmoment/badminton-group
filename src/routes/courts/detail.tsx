import { createFileRoute } from "@tanstack/react-router";
import { X, Play, Pause, Square } from "lucide-react";
import { useState } from "react";

import { useCourts } from "@/utils/zustand/useCourts";
import SelectMemberDialog from "@/components/Dialog/SelectMemberDialog";
import { getStatusColor, getStatusText, getLevelText } from "@/utils";

type DetailSearch = {
  court_id: number
}
export const Route = createFileRoute('/courts/detail')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): DetailSearch => {
    // validate and parse the search params into a typed state
    return {
      court_id: Number(search?.court_id ?? 1),
    }
  },
})

function RouteComponent() {
  const courtId = Route.useSearch().court_id;
  const navigate = Route.useNavigate();
  const [isSelectMemberDialogOpen, setIsSelectMemberDialogOpen] = useState(false);
  const [selectingSlot, setSelectingSlot] = useState<{ playerIndex: number } | null>(null);

  const {
    courts,
    removePlayer,
    selectPlayer: selectPlayerOnCourt,
    randomGrouping,
    startGame,
    pauseGame,
    endGame,
  } = useCourts();
  const selectedCourtIndex = courts.findIndex(court => court.id === courtId)
  const selectedCourt = courts[selectedCourtIndex]

  const handleOpenSelectMemberDialog = (playerIndex: number) => {
    setSelectingSlot({ playerIndex });
    setIsSelectMemberDialogOpen(true);
  };

  const handleSelectMember = (member: Member) => {
    if (selectingSlot) {
      selectPlayerOnCourt(selectedCourtIndex, selectingSlot.playerIndex, member);
    }
    setSelectingSlot(null);
  };

  const isCourtFull = selectedCourt?.players.filter(p => p !== null).length === 4;

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-800">
              {selectedCourt?.name}
            </h2>
            {selectedCourt && (
                <div className="flex items-center gap-1 text-xs">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedCourt.status)}`}></div>
                    <span className="text-gray-600">{getStatusText(selectedCourt.status)}</span>
                </div>
            )}
        </div>
        <button
          className="text-indigo-600 text-sm font-medium"
          onClick={() => navigate({ to: "..", replace: true })}
        >
          ← 返回
        </button>
      </div>

      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 mb-6 text-black">
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white bg-opacity-10 rounded-xl p-4">
            <div className="text-sm opacity-80 mb-3 font-medium">A隊</div>
            {[0, 1].map((index) => (
              <div key={index} className="relative mb-2 last:mb-0">
                {selectedCourt?.players[index] ? (
                  <div className="bg-white bg-opacity-20 rounded-lg px-2 py-1 text-lg font-medium">
                    <div className="flex items-center justify-between">
                        <div className="truncate">
                            <span className="font-semibold">{selectedCourt.players[index].name}</span>
                            <span className="text-sm opacity-80 ml-2">{getLevelText(selectedCourt.players[index].level)}</span>
                        </div>
                        <button
                          className="p-1 text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => removePlayer(selectedCourtIndex, index)}
                          disabled={selectedCourt?.status === 'playing'}
                        >
                          <X size={28} />
                        </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="border border-dashed border-white border-opacity-50 rounded-lg py-3 px-2 text-center text-md text-black text-opacity-70 cursor-pointer hover:bg-white hover:bg-opacity-10 transition-colors"
                    onClick={() => handleOpenSelectMemberDialog(index)}
                  >
                    + 選擇球員
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="bg-white bg-opacity-10 rounded-xl p-4">
            <div className="text-sm opacity-80 mb-3 font-medium">B隊</div>
            {[2, 3].map((index) => (
              <div key={index} className="relative mb-2 last:mb-0">
                {selectedCourt?.players[index] ? (
                  <div className="bg-white bg-opacity-20 rounded-lg px-2 py-1 text-lg font-medium">
                    <div className="flex items-center justify-between">
                        <div className="truncate">
                            <span className="font-semibold">{selectedCourt.players[index].name}</span>
                            <span className="text-sm opacity-80 ml-2">{getLevelText(selectedCourt.players[index].level)}</span>
                        </div>
                        <button
                          className="p-1 text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => removePlayer(selectedCourtIndex, index)}
                          disabled={selectedCourt?.status === 'playing'}
                        >
                          <X size={28} />
                        </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="border border-dashed border-white border-opacity-50 rounded-lg py-3 px-2 text-center text-md text-black text-opacity-70 cursor-pointer hover:bg-white hover:bg-opacity-10 transition-colors"
                    onClick={() => handleOpenSelectMemberDialog(index)}
                  >
                    + 選擇球員
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <div className="flex gap-3">
            {selectedCourt?.status !== 'playing' && (
                <button
                className="flex-1 py-4 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
                onClick={() => randomGrouping(selectedCourtIndex)}
                >
                隨機分組
                </button>
            )}
            {selectedCourt?.status === 'waiting' && isCourtFull && (
                <button
                    className="flex-1 py-4 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                    onClick={() => startGame(selectedCourtIndex)}
                >
                    <Play size={16} />
                    開始比賽
                </button>
            )}
            {selectedCourt?.status === 'playing' && (
                <button
                    className="flex-1 py-4 bg-yellow-500 text-white font-semibold rounded-xl hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
                    onClick={() => pauseGame(selectedCourtIndex)}
                >
                    <Pause size={16} />
                    暫停比賽
                </button>
            )}
        </div>
        {isCourtFull && selectedCourt?.status === 'playing' && (
            <button
                className="w-full py-4 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                onClick={() => endGame(selectedCourtIndex)}
            >
                <Square size={16} />
                結束比賽
            </button>
        )}
      </div>


      <SelectMemberDialog
        open={isSelectMemberDialogOpen}
        onOpenChange={setIsSelectMemberDialogOpen}
        onSelectMember={handleSelectMember}
      />
    </div>
  );
}

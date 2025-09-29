import { getAvatarColor, getLevelText, getLevelStyle } from "../utils/index";
import { Edit2, Trash2 } from "lucide-react";

import { useMembers } from "@/utils/zustand/useMembers";

type MemberCardProps = {
  selectingSlot?: boolean;
  member: Member;
  onClick?: (member: Member) => void;
  onEdit?: (member: Member) => void;
};

function getMemberLight(status: Member["status"]) {
  switch (status) {
    case "idle":
      return "bg-green-300";
    case "blocked":
      return "bg-gray-400  opacity-80";
    case "playing":
      return "bg-red-500";
  }
}
export default function MemberCard({
  selectingSlot,
  member,
  onClick,
  onEdit,
}: MemberCardProps) {
  const { updateMember, removeMember } = useMembers();

  function handleClick(e: React.MouseEvent) {
    // Stop propagation to prevent the edit button click from triggering this.
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }

    if (selectingSlot && typeof onClick !== "undefined") {
      onClick(member);
      return;
    }

    if (member.status !== "playing") {
      updateMember({
        id: member.id,
        status: member.status === "blocked" ? "idle" : "blocked",
      });
    }
  }

  return (
    <div
      className={`flex items-center p-4 border rounded-lg transition-all ${
        selectingSlot
          ? "cursor-pointer hover:border-indigo-500 hover:bg-indigo-50"
          : "border-gray-200"
      } ${member.status === "blocked" ? "bg-gray-200" : "bg-white"}`}
      onClick={handleClick}
    >
      <div
        className={`w-10 h-10 rounded-full ${getAvatarColor(member.gender)} flex items-center justify-center text-white font-semibold text-lg mr-3`}
      >
        {member.name.charAt(0)}
      </div>
      <div className="flex-1">
        <div className="flex">
          <div className="font-semibold text-lg mb-1 mr-1">{member.name}</div>
          <span
            className={`w-2 h-2 rounded-full mt-1 ${getMemberLight(member.status)}`}
          />
        </div>
        <div className="flex gap-3 text-xs text-gray-600 items-end">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelStyle(member.level)}`}
          >
            {getLevelText(member.level)}
          </span>
          <span className="pb-1">已上場:&nbsp;{member["played-times"]}</span>
        </div>
      </div>

      {!selectingSlot && (
        <>
          <button
            className="p-2 text-gray-400 hover:text-indigo-600 cursor-pointer"
            onClick={() => onEdit?.(member)}
          >
            <Edit2 size={20} />
          </button>
          <button
            className="p-2 text-gray-400 hover:text-indigo-600 cursor-pointer"
            onClick={() => removeMember(member.id)}
            disabled={member.status === "playing"}
          >
            <Trash2 size={20} />
          </button>
        </>
      )}

      {selectingSlot && (
        <div className="text-indigo-600 text-md font-medium">選擇</div>
      )}
    </div>
  );
}

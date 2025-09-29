import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, RotateCcw } from "lucide-react";
import { useMembers } from "@/utils/zustand/useMembers";
import MemberCard from "@/components/MemberCard";
import MemberDialog from "@/components//Dialog/MemberDialog";

export const Route = createFileRoute("/members")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // 所有成員名單 - from zustand store
  const { members, addMember, updateMember, resetPlayedTimes } = useMembers();

  const handleEditMember = (member: Member) => {
    setEditingMember(member);
    setIsMemberDialogOpen(true);
  };

  const handleConfirmMember = (memberData: Member | NewMember) => {
    if ('id' in memberData) {
      updateMember(memberData as Member);
    } else {
      addMember(memberData as NewMember);
    }
    setIsMemberDialogOpen(false);
  };

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          成員名單 ({members.length}人)
        </h2>
        <div className="flex gap-2">
            <button
                className="bg-red-500 cursor-pointer text-white px-3 py-2 rounded-full text-sm font-medium hover:bg-red-600 transition-colors items-center flex"
                onClick={resetPlayedTimes}
            >
                <RotateCcw size={16} className="inline mr-1" />
                清除次數
            </button>
            <button
            className="bg-indigo-500 cursor-pointer text-white px-3 py-2 rounded-full text-sm font-medium hover:bg-indigo-600 transition-colors items-center flex"
            onClick={() => {
                setEditingMember(null)
                setIsMemberDialogOpen(true);
            }}
            >
            <Plus size={16} className="inline mr-1" />
            新增
            </button>
        </div>
      </div>

      <div className="text-sm text-gray-700 mb-2">
        <div>
          *點擊卡片可以允許/禁止成員上場
        </div>
      </div>

      <div className="space-y-2">
        {members.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            onEdit={handleEditMember}
          />
        ))}
      </div>
      <MemberDialog
        open={isMemberDialogOpen}
        onOpenChange={setIsMemberDialogOpen}
        member={editingMember}
        onConfirm={handleConfirmMember}
      />
    </div>
  );
}
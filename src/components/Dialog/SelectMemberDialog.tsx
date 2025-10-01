import Dialog from "./index";
import MemberCard from "../MemberCard";
import { useMembers } from "@/utils/zustand/useMembers";
import { useCourts } from "@/utils/zustand/useCourts";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectMember: (member: Member) => void;
};

export default function SelectMemberDialog({
  open,
  onOpenChange,
  onSelectMember,
}: Props) {
  const { members } = useMembers();
  const { courts } = useCourts();

  const onCourtPlayerIds = courts
    .flatMap((court) => court.players)
    .filter((player): player is Member => player !== null)
    .map((player) => player.id);

  const availableMembers = members.filter(
    (m) => m.status === "idle" && !onCourtPlayerIds.includes(m.id)
  );

  const handleSelect = (member: Member) => {
    onSelectMember(member);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} showFooter={false}>
      <h3 className="text-lg font-semibold mb-5 text-center">選擇成員</h3>
      <div className="space-y-2 max-h-[60vh] overflow-y-auto">
        {availableMembers.length > 0 ? (
          availableMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onClick={() => handleSelect(member)}
              selectingSlot={true}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">沒有可用的成員</p>
        )}
      </div>
    </Dialog>
  );
}

import { getAvatarColor, getLevelText, getLevelStyle } from "../utils/index";

type MemberCardProps = {
  selectingSlot?: boolean;
  member: Member;
  onClick?: (member: Member) => void;
};
export default function MemberCard({ selectingSlot, member, onClick }: MemberCardProps) {

  function handleClick() {
    if (selectingSlot && typeof onClick !== 'undefined') {
      onClick(member)
    }
  }
  console.log(selectingSlot)
  return (
    <div
      className={`flex items-center p-3 bg-white border rounded-lg transition-all ${
        selectingSlot
          ? "cursor-pointer hover:border-indigo-500 hover:bg-indigo-50"
          : "border-gray-200"
      }`}
      onClick={handleClick}
    >
      <div
        className={`w-10 h-10 rounded-full ${getAvatarColor(member.gender)} flex items-center justify-center text-white font-semibold text-sm mr-3`}
      >
        {member.name.charAt(0)}
      </div>
      <div className="flex-1">
        <div className="font-semibold text-sm mb-1">{member.name}</div>
        <div className="flex gap-3 text-xs text-gray-600 items-end">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelStyle(member.level)}`}
          >
            {getLevelText(member.level)}
          </span>
          <span className="pb-1">已上場次數:&nbsp;{member["played-times"]}</span>
        </div>
      </div>
      {selectingSlot && (
        <div className="text-indigo-600 text-xs font-medium">選擇</div>
      )}
    </div>
  );
}

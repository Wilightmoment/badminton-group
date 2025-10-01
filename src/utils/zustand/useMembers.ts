import { create } from "zustand";
import { persist } from "zustand/middleware";

type MembersState = {
  members: Member[];
  addMember: (member: NewMember) => void;
  updateMember: (member: Partial<Member> & { id: number }) => void;
  removeMember: (memberId: number) => void;
  incrementPlayedTimes: (memberIds: number[]) => void;
  updateMembersStatus: (memberIds: number[], status: Member["status"]) => void;
  resetPlayedTimes: () => void;
  updateLastPlayedAt: (memberIds: number[]) => void;
};

export const useMembers = create<MembersState>()(
  persist(
    (set) => ({
      members: [],
      addMember: (newMember) =>
        set((state) => ({
          members: [
            ...state.members,
            {
              id:
                state.members.length > 0
                  ? Math.max(...state.members.map((m) => m.id)) + 1
                  : 1,
              ...newMember,
              "played-times": 0,
              status: "idle",
              lastPlayedAt: null,
            },
          ],
        })),
      updateMember: (member) =>
        set((state) => ({
          members: state.members.map((m) =>
            m.id === member.id ? { ...m, ...member } : m
          ),
        })),
      removeMember: (id) =>
        set((state) => ({
          members: state.members.filter((member) => member.id !== id),
        })),
      incrementPlayedTimes: (memberIds) =>
        set((state) => ({
          members: state.members.map((member) =>
            memberIds.includes(member.id)
              ? { ...member, "played-times": member["played-times"] + 1 }
              : member
          ),
        })),
      updateMembersStatus: (memberIds, status) =>
        set((state) => ({
          members: state.members.map((member) =>
            memberIds.includes(member.id) ? { ...member, status } : member
          ),
        })),
      resetPlayedTimes: () =>
        set((state) => ({
          members: state.members.map((member) => ({
            ...member,
            "played-times": 0,
            lastPlayedAt: null,
          })),
        })),
      updateLastPlayedAt: (memberIds) =>
        set((state) => ({
          members: state.members.map((member) =>
            memberIds.includes(member.id)
              ? { ...member, lastPlayedAt: Date.now() }
              : member
          ),
        })),
    }),
    {
      name: "members-storage",
    }
  )
);

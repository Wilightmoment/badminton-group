import { create } from "zustand";
import { persist } from 'zustand/middleware';

type MembersState = {
  members: Member[];
  addMember: (member: NewMember) => void;
  updateMember: (member: Partial<Member> & { id: number }) => void;
  removeMember: (memberId: number) => void;
  incrementPlayedTimes: (memberIds: number[]) => void;
  updateMembersStatus: (memberIds: number[], status: Member['status']) => void;
  resetPlayedTimes: () => void;
  updateLastPlayedAt: (memberIds: number[]) => void;
};

export const useMembers = create<MembersState>()(
  persist(
    (set) => ({
      members: [
        { id: 1, name: "王小明", gender: "male", level: 8, "played-times": 0, status: "idle", lastPlayedAt: null },
        { id: 2, name: "李小美", gender: "female", level: 12, "played-times": 0, status: "blocked", lastPlayedAt: null },
        { id: 3, name: "張大華", gender: "male", level: 4, "played-times": 0, status: "playing", lastPlayedAt: null },
        { id: 4, name: "陳小雯", gender: "female", level: 8, "played-times": 0, status: "idle", lastPlayedAt: null },
        { id: 5, name: "林志偉", gender: "male", level: 12, "played-times": 0, status: "idle", lastPlayedAt: null },
        { id: 6, name: "黃大成", gender: "male", level: 8, "played-times": 0, status: "idle", lastPlayedAt: null },
        { id: 7, name: "劉小君", gender: "female", level: 4, "played-times": 0, status: "idle", lastPlayedAt: null },
        { id: 8, name: "吳小華", gender: "male", level: 12, "played-times": 0, status: "idle", lastPlayedAt: null },
        { id: 9, name: "鄭小玲", gender: "female", level: 8, "played-times": 0, status: "idle", lastPlayedAt: null },
        { id: 10, name: "趙大明", gender: "male", level: 4, "played-times": 0, status: "idle", lastPlayedAt: null },
        { id: 11, name: "周小芳", gender: "female", level: 12, "played-times": 0, status: "idle", lastPlayedAt: null },
        { id: 12, name: "許志強", gender: "male", level: 8, "played-times": 0, status: "idle", lastPlayedAt: null },
      ],
      addMember: (newMember) =>
        set((state) => ({
          members: [
            ...state.members,
            {
              id: state.members.length > 0 ? Math.max(...state.members.map((m) => m.id)) + 1 : 1,
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
              ? { ...member, 'played-times': member['played-times'] + 1 }
              : member
          ),
        })),
      updateMembersStatus: (memberIds, status) =>
        set((state) => ({
          members: state.members.map((member) =>
            memberIds.includes(member.id)
              ? { ...member, status }
              : member
          ),
        })),
      resetPlayedTimes: () =>
        set((state) => ({
          members: state.members.map((member) => ({
            ...member,
            'played-times': 0,
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
      name: 'members-storage',
    }
  )
);
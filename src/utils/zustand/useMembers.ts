import { create } from 'zustand';

type MembersState = {
  members: Member[];
  addMember: (member: NewMember) => void;
};

export const useMembers = create<MembersState>((set) => ({
  members: [
    { id: 1, name: '王小明', gender: 'male', level: 8, 'played-times': 0 },
    { id: 2, name: '李小美', gender: 'female', level: 12, 'played-times': 0 },
    { id: 3, name: '張大華', gender: 'male', level: 4, 'played-times': 0 },
    { id: 4, name: '陳小雯', gender: 'female', level: 8, 'played-times': 0 },
    { id: 5, name: '林志偉', gender: 'male', level: 12, 'played-times': 0 },
    { id: 6, name: '黃大成', gender: 'male', level: 8, 'played-times': 0 },
    { id: 7, name: '劉小君', gender: 'female', level: 4, 'played-times': 0 },
    { id: 8, name: '吳小華', gender: 'male', level: 12, 'played-times': 0 },
    { id: 9, name: '鄭小玲', gender: 'female', level: 8, 'played-times': 0 },
    { id: 10, name: '趙大明', gender: 'male', level: 4, 'played-times': 0 },
    { id: 11, name: '周小芳', gender: 'female', level: 12, 'played-times': 0 },
    { id: 12, name: '許志強', gender: 'male', level: 8, 'played-times': 0 }
  ],
  addMember: (newMember) =>
    set((state) => ({
      members: [
        ...state.members,
        {
          id: state.members.length > 0 ? Math.max(...state.members.map(m => m.id)) + 1 : 1,
          ...newMember,
          'played-times': 0,
        },
      ],
    })),
}));

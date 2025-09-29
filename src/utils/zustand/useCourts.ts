import { create } from 'zustand';
import { useMembers } from './useMembers';

export type Court = {
  id: number;
  name: string;
  status: 'playing' | 'waiting' | 'idle';
  players: (Member | null)[];
};

type CourtsState = {
  courts: Court[];
  addCourt: () => void;
  removePlayer: (courtIndex: number, playerIndex: number) => void;
  selectPlayer: (courtIndex: number, playerIndex: number, member: Member) => void;
  randomGrouping: (courtIndex: number) => void;
};

// Get initial members from useMembers store to build initial court state
const initialMembers = useMembers.getState().members;
const findMember = (name: string): Member | null => initialMembers.find(m => m.name === name) || null;

export const useCourts = create<CourtsState>((set) => ({
  courts: [
    { id: 1, name: '場地 A', status: 'playing', players: [findMember('王小明'), findMember('李小美'), findMember('張大華'), findMember('陳小雯')] },
    { id: 2, name: '場地 B', status: 'waiting', players: [findMember('林志偉'), null, findMember('黃大成'), null] },
    { id: 3, name: '場地 C', status: 'idle', players: [null, null, null, null] },
    { id: 4, name: '場地 D', status: 'idle', players: [null, null, null, null] }
  ],
  addCourt: () => {
    set(state => {
      const newCourt: Court = {
        id: state.courts.length > 0 ? Math.max(...state.courts.map(c => c.id)) + 1 : 1,
        name: `場地 ${String.fromCharCode(65 + state.courts.length)}`,
        status: 'idle',
        players: [null, null, null, null]
      };
      return { courts: [...state.courts, newCourt] };
    });
  },
  removePlayer: (courtIndex, playerIndex) => {
    set(state => {
      const updatedCourts = JSON.parse(JSON.stringify(state.courts));
      updatedCourts[courtIndex].players[playerIndex] = null;
      return { courts: updatedCourts };
    });
  },
  selectPlayer: (courtIndex, playerIndex, member) => {
    set(state => {
      const updatedCourts = JSON.parse(JSON.stringify(state.courts));
      updatedCourts[courtIndex].players[playerIndex] = member;
      return { courts: updatedCourts };
    });
  },
  randomGrouping: (courtIndex) => {
    const allMembers = useMembers.getState().members;
    set(state => {
      const updatedCourts = JSON.parse(JSON.stringify(state.courts));
      const currentCourt = updatedCourts[courtIndex];
      
      const onCourtMemberIds = currentCourt.players
        .filter((p: Member | null): p is Member => p !== null)
        .map((p: Member) => p.id);
        
      const availableMembers = allMembers.filter(m => !onCourtMemberIds.includes(m.id));
      
      const emptySlots = currentCourt.players
        .map((p: Member | null, i: number) => (p === null ? i : -1))
        .filter((i: number) => i !== -1);
      
      const shuffled = [...availableMembers].sort(() => Math.random() - 0.5);
      
      emptySlots.forEach((slotIndex: number, i: number) => {
        if (shuffled[i]) {
          currentCourt.players[slotIndex] = shuffled[i];
        }
      });
      
      return { courts: updatedCourts };
    });
  }
}));

type Member = {
  id: number;
  name: string;
  gender: 'male' | 'female' | '';
  level: number;
  'played-times': number;
  status: 'idle' | 'playing' | 'blocked';
  lastPlayedAt: number | null;
};

type NewMember = Omit<Member, 'id' | 'played-times' | 'status' | 'lastPlayedAt'>;

type Court = {
  id: number;
  name: string;
  status: 'playing' | 'waiting' | 'idle';
  players: (Member | null)[];
};

type CourtsState = {
  courts: Court[];
  addCourt: () => void;
  removeCourt: (courtId: number) => void;
  removePlayer: (courtIndex: number, playerIndex: number) => void;
  selectPlayer: (courtIndex: number, playerIndex: number, member: Member) => void;
  randomGrouping: (courtIndex: number) => void;
  fillIncompleteCourts: () => void;
  startGame: (courtIndex: number) => void;
  pauseGame: (courtIndex: number) => void;
  endGame: (courtIndex: number) => void;
};
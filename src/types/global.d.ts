type Member = {
  id: number;
  name: string;
  gender: 'male' | 'female' | '';
  level: number;
  'played-times': number;
};

type NewMember = Omit<Member, 'id' | 'played-times'>;
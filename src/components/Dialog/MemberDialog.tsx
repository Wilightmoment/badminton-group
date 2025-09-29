import { useState, useEffect } from 'react';
import Dialog from './';
import { getLevelText } from '@/utils';

const EmptyMember: NewMember = {
  name: "",
  gender: "",
  level: 1,
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member | null;
  onConfirm: (member: Member | NewMember) => void;
};

export default function MemberDialog({ open, onOpenChange, member, onConfirm }: Props) {
  const [formData, setFormData] = useState<Member | NewMember>(EmptyMember);

  useEffect(() => {
    setFormData(member || EmptyMember);
  }, [member, open]);

  const handleConfirm = () => {
    if (formData.name && formData.gender) {
      onConfirm(formData);
      onOpenChange(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={handleConfirm}
    >
      <h3 className="text-lg font-semibold mb-5 text-center">{member ? '編輯成員' : '新增成員'}</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">姓名</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg text-sm"
            placeholder="請輸入姓名"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">性別</label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-white"
            value={formData.gender}
            onChange={(e) => setFormData({...formData, gender: e.target.value as 'male' | 'female'})}
          >
            <option value="">請選擇性別</option>
            <option value="male">男性</option>
            <option value="female">女性</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">等級: {getLevelText(formData.level)}</label>
          <input
            type="range"
            min="1"
            max="18"
            value={formData.level}
            onChange={(e) => setFormData({...formData, level: parseInt(e.target.value, 10)})}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </Dialog>
  );
}

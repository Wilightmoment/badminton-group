import { useState } from 'react';
import { Plus, X, Users, MapPin, Home } from 'lucide-react';

const BadmintonApp = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState(null);
  
  // 場地狀態 - 每個場地獨立管理球員
  const [courts, setCourts] = useState([
    { id: 1, name: '場地 A', status: 'playing', players: ['王小明', '李小美', '張大華', '陳小雯'] },
    { id: 2, name: '場地 B', status: 'waiting', players: ['林志偉', null, '黃大成', null] },
    { id: 3, name: '場地 C', status: 'idle', players: [null, null, null, null] },
    { id: 4, name: '場地 D', status: 'idle', players: [null, null, null, null] }
  ]);

  // 所有成員名單 - 獨立管理，不受場地影響
  const [members, setMembers] = useState([
    { id: 1, name: '王小明', gender: 'male', level: 'intermediate' },
    { id: 2, name: '李小美', gender: 'female', level: 'advanced' },
    { id: 3, name: '張大華', gender: 'male', level: 'beginner' },
    { id: 4, name: '陳小雯', gender: 'female', level: 'intermediate' },
    { id: 5, name: '林志偉', gender: 'male', level: 'advanced' },
    { id: 6, name: '黃大成', gender: 'male', level: 'intermediate' },
    { id: 7, name: '劉小君', gender: 'female', level: 'beginner' },
    { id: 8, name: '吳小華', gender: 'male', level: 'advanced' },
    { id: 9, name: '鄭小玲', gender: 'female', level: 'intermediate' },
    { id: 10, name: '趙大明', gender: 'male', level: 'beginner' },
    { id: 11, name: '周小芳', gender: 'female', level: 'advanced' },
    { id: 12, name: '許志強', gender: 'male', level: 'intermediate' }
  ]);

  const [newMember, setNewMember] = useState({ name: '', gender: '', level: '' });
  const [selectingSlot, setSelectingSlot] = useState(null); // { courtIndex, playerIndex }

  // 新增成員
  const addMember = () => {
    if (newMember.name && newMember.gender && newMember.level) {
      const member = {
        id: members.length + 1,
        ...newMember
      };
      setMembers([...members, member]);
      setNewMember({ name: '', gender: '', level: '' });
      setShowMemberModal(false);
    }
  };

  // 新增場地
  const addCourt = () => {
    const newCourt = {
      id: courts.length + 1,
      name: `場地 ${String.fromCharCode(65 + courts.length)}`,
      status: 'idle',
      players: [null, null, null, null]
    };
    setCourts([...courts, newCourt]);
  };

  // 移除場上球員
  const removePlayer = (courtIndex, playerIndex) => {
    const updatedCourts = [...courts];
    updatedCourts[courtIndex].players[playerIndex] = null;
    setCourts(updatedCourts);
  };

  // 選擇球員填入空位
  const selectPlayer = (memberName) => {
    if (selectingSlot) {
      const { courtIndex, playerIndex } = selectingSlot;
      const updatedCourts = [...courts];
      updatedCourts[courtIndex].players[playerIndex] = memberName;
      setCourts(updatedCourts);
      setSelectingSlot(null);
    }
  };

  // 隨機分組
  const randomGrouping = (courtIndex) => {
    const updatedCourts = [...courts];
    const currentCourt = updatedCourts[courtIndex];
    
    // 獲取所有可用成員（不在當前場地上的）
    const onCourtMembers = currentCourt.players.filter(p => p !== null);
    const availableMembers = members
      .filter(m => !onCourtMembers.includes(m.name))
      .map(m => m.name);
    
    // 找到空位
    const emptySlots = currentCourt.players
      .map((p, i) => p === null ? i : -1)
      .filter(i => i !== -1);
    
    // 隨機填入空位
    const shuffled = [...availableMembers].sort(() => Math.random() - 0.5);
    emptySlots.forEach((slotIndex, i) => {
      if (shuffled[i]) {
        currentCourt.players[slotIndex] = shuffled[i];
      }
    });
    
    setCourts(updatedCourts);
  };

  // 獲取成員資料
  const getMemberData = (name) => {
    return members.find(m => m.name === name);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'playing': return 'bg-green-500';
      case 'waiting': return 'bg-yellow-500';
      case 'idle': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'playing': return '進行中';
      case 'waiting': return '等待中';
      case 'idle': return '空閒';
      default: return '未知';
    }
  };

  const getLevelStyle = (level) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getLevelText = (level) => {
    switch (level) {
      case 'beginner': return '初級';
      case 'intermediate': return '中級';
      case 'advanced': return '高級';
      default: return '未知';
    }
  };

  const getAvatarColor = (gender) => {
    return gender === 'female' 
      ? 'bg-gradient-to-br from-pink-400 to-pink-600' 
      : 'bg-gradient-to-br from-blue-400 to-blue-600';
  };

  return (
    <div className="max-w-sm mx-auto bg-gray-50 min-h-screen shadow-xl relative pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-5 pt-12 pb-5 text-center">
        <h1 className="text-2xl font-bold mb-2">羽球分組助手</h1>
        <p className="text-sm opacity-90">智能分組 · 公平競技</p>
      </div>

      {/* Content */}
      <div className="min-h-[calc(100vh-200px)] pb-4">
        {/* Home Tab - 顯示所有場地 */}
        {activeTab === 'home' && (
          <div className="p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">所有場地</h2>
              <button
                className="bg-indigo-500 text-white px-4 py-2 rounded-full text-xs font-medium hover:bg-indigo-600 transition-colors flex items-center gap-1"
                onClick={addCourt}
              >
                <Plus size={14} />
                新增場地
              </button>
            </div>
            
            <div className="space-y-4">
              {courts.map((court, courtIndex) => (
                <div key={court.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg text-gray-800">{court.name}</h3>
                      <div className="flex items-center gap-1 text-xs">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(court.status)}`}></div>
                        <span className="text-gray-600">{getStatusText(court.status)}</span>
                      </div>
                    </div>
                    <button
                      className="text-indigo-600 text-sm font-medium hover:text-indigo-700"
                      onClick={() => {
                        setSelectedCourt(courtIndex);
                        setActiveTab('current');
                      }}
                    >
                      詳細 →
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-xs text-blue-700 font-medium mb-2">A隊</div>
                      {[0, 1].map(index => (
                        <div key={index} className="text-xs mb-1 last:mb-0 text-gray-700 truncate">
                          {court.players[index] ? `• ${court.players[index]}` : '• 空位'}
                        </div>
                      ))}
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="text-xs text-purple-700 font-medium mb-2">B隊</div>
                      {[2, 3].map(index => (
                        <div key={index} className="text-xs mb-1 last:mb-0 text-gray-700 truncate">
                          {court.players[index] ? `• ${court.players[index]}` : '• 空位'}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                成員名單 ({members.length}人)
              </h2>
              <button
                className="bg-indigo-500 text-white px-4 py-2 rounded-full text-xs font-medium hover:bg-indigo-600 transition-colors"
                onClick={() => setShowMemberModal(true)}
              >
                <Plus size={12} className="inline mr-1" />
                新增
              </button>
            </div>

            <div className="space-y-2">
              {members.map((member) => (
                <div 
                  key={member.id} 
                  className={`flex items-center p-3 bg-white border rounded-lg transition-all ${
                    selectingSlot ? 'cursor-pointer hover:border-indigo-500 hover:bg-indigo-50' : 'border-gray-200'
                  }`}
                  onClick={() => selectingSlot && selectPlayer(member.name)}
                >
                  <div className={`w-10 h-10 rounded-full ${getAvatarColor(member.gender)} flex items-center justify-center text-white font-semibold text-sm mr-3`}>
                    {member.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm mb-1">{member.name}</div>
                    <div className="flex gap-3 text-xs text-gray-600">
                      <span>{member.gender === 'male' ? '男性' : '女性'}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelStyle(member.level)}`}>
                        {getLevelText(member.level)}
                      </span>
                    </div>
                  </div>
                  {selectingSlot && (
                    <div className="text-indigo-600 text-xs font-medium">選擇</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current Court Tab */}
        {activeTab === 'current' && selectedCourt !== null && (
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">{courts[selectedCourt]?.name}</h2>
              <button
                className="text-indigo-600 text-sm font-medium"
                onClick={() => setActiveTab('home')}
              >
                ← 返回
              </button>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 mb-6 text-black">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white bg-opacity-10 rounded-xl p-4">
                  <div className="text-xs opacity-80 mb-3 font-medium">A隊</div>
                  {[0, 1].map(index => (
                    <div key={index} className="relative mb-2 last:mb-0">
                      {courts[selectedCourt]?.players[index] ? (
                        <div className="bg-white bg-opacity-20 rounded-lg p-3 text-sm font-medium relative">
                          <button
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-black text-xs hover:bg-red-600 transition-colors flex items-center justify-center"
                            onClick={() => removePlayer(selectedCourt, index)}
                          >
                            <X size={12} />
                          </button>
                          <div className="pr-4 truncate">{courts[selectedCourt].players[index]}</div>
                        </div>
                      ) : (
                        <div 
                          className="border border-dashed border-white border-opacity-50 rounded-lg p-3 text-center text-sm text-black text-opacity-70 cursor-pointer hover:bg-white hover:bg-opacity-10 transition-colors"
                          onClick={() => {
                            setSelectingSlot({ courtIndex: selectedCourt, playerIndex: index });
                            setActiveTab('members');
                          }}
                        >
                          + 選擇球員
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="bg-white bg-opacity-10 rounded-xl p-4">
                  <div className="text-xs opacity-80 mb-3 font-medium">B隊</div>
                  {[2, 3].map(index => (
                    <div key={index} className="relative mb-2 last:mb-0">
                      {courts[selectedCourt]?.players[index] ? (
                        <div className="bg-white bg-opacity-20 rounded-lg p-3 text-sm font-medium relative">
                          <button
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-black text-xs hover:bg-red-600 transition-colors flex items-center justify-center"
                            onClick={() => removePlayer(selectedCourt, index)}
                          >
                            <X size={12} />
                          </button>
                          <div className="pr-4 truncate">{courts[selectedCourt].players[index]}</div>
                        </div>
                      ) : (
                        <div 
                          className="border border-dashed border-white border-opacity-50 rounded-lg p-3 text-center text-sm text-black text-opacity-70 cursor-pointer hover:bg-white hover:bg-opacity-10 transition-colors"
                          onClick={() => {
                            setSelectingSlot({ courtIndex: selectedCourt, playerIndex: index });
                            setActiveTab('members');
                          }}
                        >
                          + 選擇球員
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button 
                className="flex-1 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                onClick={() => {
                  setSelectingSlot({ courtIndex: selectedCourt, playerIndex: null });
                  setActiveTab('members');
                }}
              >
                手動排人
              </button>
              <button 
                className="flex-1 py-4 bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-600 transition-colors"
                onClick={() => randomGrouping(selectedCourt)}
              >
                隨機分組
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto bg-white border-t border-gray-200 shadow-lg">
        <div className="flex">
          {[
            { key: 'home', label: '場地', icon: Home },
            { key: 'members', label: '成員', icon: Users },
            { key: 'current', label: '當前', icon: MapPin }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`flex-1 py-3 px-2 text-xs font-medium transition-colors ${
                activeTab === key
                  ? 'text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                if (key === 'current' && selectedCourt === null) {
                  setSelectedCourt(0);
                }
                setActiveTab(key);
                if (key !== 'members') {
                  setSelectingSlot(null);
                }
              }}
            >
              <div className="flex flex-col items-center gap-1">
                <Icon size={20} />
                <span>{label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Add Member Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-80 mx-4">
            <h3 className="text-lg font-semibold mb-5 text-center">新增成員</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">姓名</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                  placeholder="請輸入姓名"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">性別</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-white"
                  value={newMember.gender}
                  onChange={(e) => setNewMember({...newMember, gender: e.target.value})}
                >
                  <option value="">請選擇性別</option>
                  <option value="male">男性</option>
                  <option value="female">女性</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">等級</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-white"
                  value={newMember.level}
                  onChange={(e) => setNewMember({...newMember, level: e.target.value})}
                >
                  <option value="">請選擇等級</option>
                  <option value="beginner">初級</option>
                  <option value="intermediate">中級</option>
                  <option value="advanced">高級</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                onClick={() => {
                  setShowMemberModal(false);
                  setNewMember({ name: '', gender: '', level: '' });
                }}
              >
                取消
              </button>
              <button
                className="flex-1 py-3 bg-indigo-500 text-white font-medium rounded-xl hover:bg-indigo-600 transition-colors"
                onClick={addMember}
              >
                確認
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selecting Player Hint */}
      {selectingSlot && activeTab === 'members' && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-4 py-2 rounded-full text-sm shadow-lg z-40">
          點擊成員選擇球員
        </div>
      )}
    </div>
  );
};

export default BadmintonApp;
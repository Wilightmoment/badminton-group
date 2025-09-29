export const getLevelStyle = (level: number): string => {
  if (level >= 1 && level <= 3) {
    return 'bg-gray-100 text-gray-700'; // 新手階
  } else if (level >= 4 && level <= 5) {
    return 'bg-green-100 text-green-700'; // 初階
  } else if (level === 6) {
    return 'bg-cyan-100 text-cyan-700'; // 初中階(上)
  } else if (level === 7) {
    return 'bg-teal-100 text-teal-700'; // 初中階(下)
  } else if (level >= 8 && level <= 9) {
    return 'bg-yellow-100 text-yellow-700'; // 中階
  } else if (level >= 10 && level <= 12) {
    return 'bg-orange-100 text-orange-700'; // 中進階
  } else if (level >= 13 && level <= 15) {
    return 'bg-red-100 text-red-700'; // 高階
  } else if (level >= 16 && level <= 18) {
    return 'bg-purple-100 text-purple-700'; // 職業
  }
  return 'bg-gray-100 text-gray-700';
};

export const getLevelText = (level: number): string => {
  if (level >= 1 && level <= 3) {
    return `新手階 (${level})`;
  } else if (level >= 4 && level <= 5) {
    return `初階 (${level})`;
  } else if (level === 6) {
    return `初中階(上) (${level})`;
  } else if (level === 7) {
    return `初中階(下) (${level})`;
  } else if (level >= 8 && level <= 9) {
    return `中階 (${level})`;
  } else if (level >= 10 && level <= 12) {
    return `中進階 (${level})`;
  } else if (level >= 13 && level <= 15) {
    return `高階 (${level})`;
  } else if (level >= 16 && level <= 18) {
    return `職業 (${level})`;
  }
  return `未知 (${level})`;
};

export const getAvatarColor = (gender: string) => {
  return gender === 'female' 
    ? 'bg-gradient-to-br from-pink-400 to-pink-600' 
    : 'bg-gradient-to-br from-blue-400 to-blue-600';
};

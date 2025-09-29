const TIME_WIEGHT_RATIO = 0.6;
const COUNT_WEIGHT_RATIO = 0.4;

interface Court {
  teamA: Member[];
  teamB: Member[];
}

// 將值正規化到 [0,1]
function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return (value - min) / (max - min);
}

// 隨機加權抽樣
function weightedRandomSample(members: Array<Member & { finalWeight: number }>, count: number): Member[] {
  const result: Member[] = [];
  const pool = [...members];

  for (let i = 0; i < count && pool.length > 0; i++) {
    const totalWeight = pool.reduce(
      (sum, member) => sum +member.finalWeight,
      0
    );
    let rnd = Math.random() * totalWeight;
    let chosenIndex = 0;

    for (let j = 0; j < pool.length; j++) {
      rnd -= pool[j].finalWeight;
      if (rnd <= 0) {
        chosenIndex = j;
        break;
      }
    }

    result.push(pool[chosenIndex]);
    pool.splice(chosenIndex, 1);
  }
  return result;
}

// 主演算法：依據場地數量分組，每場 4 人，分 A/B 隊
export function randomizeCourts(
  members: Member[],
  courtCount: number
): Court[] {
  const now = Date.now();
  const idleMembers: Array<Member & { finalWeight: number }> = members
    .filter((m) => m.status === "idle")
    .map((member) => ({
      ...member,
      finalWeight: 0,
    }));

  if (idleMembers.length === 0) return [];

  // Step 1: 計算權重
  const times = idleMembers.map((m) =>
    m.lastPlayedAt ? now - m.lastPlayedAt : Number.MAX_SAFE_INTEGER
  );
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);

  idleMembers.forEach((member) => {
    const timeWeight = member.lastPlayedAt
      ? normalize(now - member.lastPlayedAt, minTime, maxTime)
      : 1; // 從未上場
    const countWeight = 1 / (member["played-times"] + 1);
    member.finalWeight =
      TIME_WIEGHT_RATIO * timeWeight + COUNT_WEIGHT_RATIO * countWeight;
  });

  // Step 2: 加權抽樣，抽取總共需要的人數（courtCount * 4）
  const totalPlayers = courtCount * 4;
  const selected = weightedRandomSample(
    idleMembers,
    Math.min(totalPlayers, idleMembers.length)
  );

  // Step 3: 將成員分配到各場地
  const courts: Court[] = Array.from({ length: courtCount }, () => ({
    teamA: [],
    teamB: [],
  }));

  for (let i = 0; i < courtCount; i++) {
    const start = i * 4;
    const end = start + 4;
    const courtPlayers = selected.slice(start, end);
    if (courtPlayers.length === 0) continue;

    // Step 4: 依等級排序
    const sorted = courtPlayers.sort((a, b) => b.level - a.level);

    // Step 5: 分隊（高低互補）
    const teamA: Member[] = [];
    const teamB: Member[] = [];

    sorted.forEach((player, idx) => {
      if (idx % 2 === 0) teamA.push(player);
      else teamB.push(player);
    });

    courts[i].teamA = teamA;
    courts[i].teamB = teamB;
  }

  return courts;
}

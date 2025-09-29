export const TIME_WIEGHT_RATIO = 0.6;
export const COUNT_WEIGHT_RATIO = 0.4;

export interface CourtAssignment {
  teamA: Member[];
  teamB: Member[];
}

// 將值正規化到 [0,1]
export function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return (value - min) / (max - min);
}

// 隨機加權抽樣
export function weightedRandomSample(
  members: Array<Member & { finalWeight: number }>,
  count: number
): Member[] {
  const result: Member[] = [];
  const pool = [...members];

  for (let i = 0; i < count && pool.length > 0; i++) {
    const totalWeight = pool.reduce(
      (sum, member) => sum + member.finalWeight,
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

export function randomizeCourtGroups(
  members: Member[],
  courtCount: number,
  allowedThreshold = 2,
  maxIterations = 50
): CourtAssignment[] {
  const now = Date.now();
  const idleMembers: Array<Member & { finalWeight: number }> = members
    .filter((member) => member.status === "idle")
    .map((member) => ({ ...member, finalWeight: 0 }));

  const playersPerCourt = 4;
  const numCourtsToCreate = Math.min(courtCount, Math.floor(idleMembers.length / playersPerCourt));
  
  if (numCourtsToCreate === 0) return [];

  // Step 1: 計算權重
  const times = idleMembers.map((m) =>
    m.lastPlayedAt ? now - m.lastPlayedAt : Number.MAX_SAFE_INTEGER
  );
  const minTime = Math.min(...times.filter(t => isFinite(t)));
  const maxTime = Math.max(...times.filter(t => isFinite(t)));

  idleMembers.forEach((member) => {
    const timeSinceLastPlayed = member.lastPlayedAt ? now - member.lastPlayedAt : Number.MAX_SAFE_INTEGER;
    const timeWeight = isFinite(timeSinceLastPlayed) ? normalize(timeSinceLastPlayed, minTime, maxTime) : 1;
    const countWeight = 1 / (member["played-times"] + 1);
    member.finalWeight =
      TIME_WIEGHT_RATIO * timeWeight + COUNT_WEIGHT_RATIO * countWeight;
  });

  // Step 2: 加權抽樣
  const selected = weightedRandomSample(idleMembers, numCourtsToCreate * playersPerCourt);

  // Step 3: 初步分組
  const groups: { members: Member[] }[] = Array.from({ length: numCourtsToCreate }, () => ({
    members: [],
  }));
  selected.forEach((m, idx) => {
    groups[idx % numCourtsToCreate].members.push(m);
  });

  // Step 4: 等級平衡 (Inter-group balancing)
  let iteration = 0;
  while (iteration < maxIterations) {
    if (groups.length <= 1) break; // No need to balance if there's only one group

    const averages = groups.map(
      (g) =>
        g.members.reduce((sum, m) => sum + m.level, 0) / (g.members.length || 1)
    );

    const maxAvg = Math.max(...averages);
    const minAvg = Math.min(...averages);

    if (maxAvg - minAvg <= allowedThreshold) break;

    const maxIdx = averages.indexOf(maxAvg);
    const minIdx = averages.indexOf(minAvg);
    
    const strongGroup = groups[maxIdx];
    const weakGroup = groups[minIdx];

    if (!strongGroup || !weakGroup) break;

    const strongMember = strongGroup.members.reduce((prev, current) => (prev.level > current.level) ? prev : current);
    const weakMember = weakGroup.members.reduce((prev, current) => (prev.level < current.level) ? prev : current);

    if (strongMember && weakMember && strongMember.id !== weakMember.id) {
      strongGroup.members = strongGroup.members.filter((m) => m.id !== strongMember.id).concat(weakMember);
      weakGroup.members = weakGroup.members.filter((m) => m.id !== weakMember.id).concat(strongMember);
    } else {
      break;
    }

    iteration++;
  }

  // Step 5: Final team assignment (Intra-group balancing)
  const courtAssignments: CourtAssignment[] = groups.map(group => {
    const groupMembers = [...group.members];
    if (groupMembers.length !== playersPerCourt) {
        // This shouldn't happen with the current logic, but as a safeguard:
        return { teamA: [], teamB: [] }; 
    }

    groupMembers.sort((a, b) => b.level - a.level);
    
    const teamA = [groupMembers[0], groupMembers[3]];
    const teamB = [groupMembers[1], groupMembers[2]];

    return { teamA, teamB };
  }).filter(assignment => assignment.teamA.length > 0); // Filter out empty assignments

  return courtAssignments;
}

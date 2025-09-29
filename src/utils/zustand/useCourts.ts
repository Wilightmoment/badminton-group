import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useMembers } from "./useMembers";
import {
  randomizeCourtGroups,
  normalize,
  weightedRandomSample,
  TIME_WIEGHT_RATIO,
  COUNT_WEIGHT_RATIO,
} from "../randomGroup";

// Get initial members from useMembers store to build initial court state
const initialMembers = useMembers.getState().members;
const findMember = (name: string): Member | null =>
  initialMembers.find((m) => m.name === name) || null;

export const useCourts = create<CourtsState>()(
  persist(
    (set) => ({
      courts: [
        {
          id: 1,
          name: "場地 A",
          status: "waiting",
          players: [
            findMember("王小明"),
            findMember("李小美"),
            findMember("張大華"),
            findMember("陳小雯"),
          ],
        },
        {
          id: 2,
          name: "場地 B",
          status: "waiting",
          players: [findMember("林志偉"), null, findMember("黃大成"), null],
        },
        {
          id: 3,
          name: "場地 C",
          status: "idle",
          players: [null, null, null, null],
        },
        {
          id: 4,
          name: "場地 D",
          status: "idle",
          players: [null, null, null, null],
        },
      ],
      addCourt: () => {
        set((state) => {
          const newCourt: Court = {
            id:
              state.courts.length > 0
                ? Math.max(...state.courts.map((c) => c.id)) + 1
                : 1,
            name: `場地 ${String.fromCharCode(65 + state.courts.length)}`,
            status: "idle",
            players: [null, null, null, null],
          };
          return { courts: [...state.courts, newCourt] };
        });
      },
      removeCourt: (courtId) => {
        const { updateMembersStatus } = useMembers.getState();
        set((state) => {
          const courtToRemove = state.courts.find((c) => c.id === courtId);
          if (courtToRemove) {
            const playerIds = courtToRemove.players
              .filter((p: Member | null): p is Member => p !== null)
              .map((p: Member) => p.id);
            if (playerIds.length > 0) {
              updateMembersStatus(playerIds, "idle");
            }
          }
          return { courts: state.courts.filter((c) => c.id !== courtId) };
        });
      },
      removePlayer: (courtIndex, playerIndex) => {
        set((state) => {
          const updatedCourts: Court[] = JSON.parse(
            JSON.stringify(state.courts)
          );
          const court = updatedCourts[courtIndex];
          court.players[playerIndex] = null;

          const playerCount = court.players.filter((p) => p !== null).length;
          if (playerCount === 0) {
            court.status = "idle";
          } else {
            court.status = "waiting"; // Any change from a game stops it.
          }

          return { courts: updatedCourts };
        });
      },
      selectPlayer: (courtIndex, playerIndex, member) => {
        set((state) => {
          const updatedCourts = JSON.parse(JSON.stringify(state.courts));
          const court = updatedCourts[courtIndex];
          court.players[playerIndex] = member;

          if (court.status === "idle") {
            court.status = "waiting";
          }

          return { courts: updatedCourts };
        });
      },
      randomGrouping: (courtIndex) => {
        const { members, updateMembersStatus } = useMembers.getState();
        set((state) => {
          const updatedCourts: Court[] = JSON.parse(
            JSON.stringify(state.courts)
          );
          const currentCourt = updatedCourts[courtIndex];

          // Release original players on the current court
          const originalPlayerIds = currentCourt.players
            .filter((p): p is Member => p !== null)
            .map((p) => p.id);
          if (originalPlayerIds.length > 0) {
            updateMembersStatus(originalPlayerIds, "idle");
          }

          // Find all players on OTHER courts to exclude them
          const otherCourts = updatedCourts.filter((_, i) => i !== courtIndex);
          const onOtherCourtsPlayerIds = otherCourts
            .flatMap((c) => c.players)
            .filter((p): p is Member => p !== null)
            .map((p) => p.id);

          // Available members are idle and not on other courts
          const availableMembers = members.filter(
            (m) => m.status === "idle" && !onOtherCourtsPlayerIds.includes(m.id)
          );

          const assignments = randomizeCourtGroups(availableMembers, 1);

          if (assignments.length > 0) {
            const { teamA, teamB } = assignments[0];
            currentCourt.players = [teamA[0], teamA[1], teamB[0], teamB[1]];
            currentCourt.status = "waiting";
          } else {
            // If no assignment could be made, clear the court
            currentCourt.players = [null, null, null, null];
            currentCourt.status = "idle";
          }

          return { courts: updatedCourts };
        });
      },
      fillIncompleteCourts: () => {
        const { members } = useMembers.getState();
        set((state) => {
          const updatedCourts: Court[] = JSON.parse(
            JSON.stringify(state.courts)
          );

          const onCourtPlayerIds = updatedCourts
            .flatMap((c) => c.players)
            .filter((p): p is Member => p !== null)
            .map((p) => p.id);

          const availableMembers = members
            .filter(
              (m) => m.status === "idle" && !onCourtPlayerIds.includes(m.id)
            )
            .map((member) => ({ ...member, finalWeight: 0 }));

          if (availableMembers.length === 0) {
            return { courts: updatedCourts };
          }

          // Calculate weights for available members
          const now = Date.now();
          const times = availableMembers.map((m) =>
            m.lastPlayedAt ? now - m.lastPlayedAt : Number.MAX_SAFE_INTEGER
          );
          const minTime = Math.min(...times.filter((t) => isFinite(t)));
          const maxTime = Math.max(...times.filter((t) => isFinite(t)));

          availableMembers.forEach((member) => {
            const timeSinceLastPlayed = member.lastPlayedAt
              ? now - member.lastPlayedAt
              : Number.MAX_SAFE_INTEGER;
            const timeWeight = isFinite(timeSinceLastPlayed)
              ? normalize(timeSinceLastPlayed, minTime, maxTime)
              : 1;
            const countWeight = 1 / (member["played-times"] + 1);
            member.finalWeight =
              TIME_WIEGHT_RATIO * timeWeight + COUNT_WEIGHT_RATIO * countWeight;
          });

          // Find all empty slots
          const emptySlots: { courtIndex: number; playerIndex: number }[] = [];
          updatedCourts.forEach((court, courtIndex) => {
            if (court.players.filter((p) => p !== null).length < 4) {
              court.players.forEach((player, playerIndex) => {
                if (player === null) {
                  emptySlots.push({ courtIndex, playerIndex });
                }
              });
            }
          });

          if (emptySlots.length === 0) {
            return { courts: updatedCourts };
          }

          const playersToFill = weightedRandomSample(
            availableMembers,
            emptySlots.length
          );

          playersToFill.forEach((player, i) => {
            const slot = emptySlots[i];
            if (slot) {
              updatedCourts[slot.courtIndex].players[slot.playerIndex] = player;
            }
          });

          const affectedCourtIndexes = [
            ...new Set(emptySlots.map((s) => s.courtIndex)),
          ];
          affectedCourtIndexes.forEach((index) => {
            const court = updatedCourts[index];
            const playerCount = court.players.filter((p) => p !== null).length;
            if (playerCount > 0) {
              court.status = "waiting";
            }
          });

          return { courts: updatedCourts };
        });
      },
      startGame: (courtIndex) => {
        const { updateMembersStatus } = useMembers.getState();
        set((state) => {
          const updatedCourts: Court[] = JSON.parse(
            JSON.stringify(state.courts)
          );
          const court = updatedCourts[courtIndex];
          const playerCount = court.players.filter((p) => p !== null).length;

          if (playerCount === 4) {
            court.status = "playing";
            const playerIds = court.players.map((p) => p!.id);
            updateMembersStatus(playerIds, "playing");
          }
          return { courts: updatedCourts };
        });
      },
      pauseGame: (courtIndex) => {
        const { updateMembersStatus } = useMembers.getState();
        set((state) => {
          const updatedCourts = JSON.parse(JSON.stringify(state.courts));
          const court = updatedCourts[courtIndex];
          if (court.status === "playing") {
            court.status = "waiting";
            const playerIds = court.players
              .filter((p: Member | null): p is Member => p !== null)
              .map((p: Member) => p.id);
            updateMembersStatus(playerIds, "idle");
          }
          return { courts: updatedCourts };
        });
      },
      endGame: (courtIndex) => {
        const {
          incrementPlayedTimes,
          updateMembersStatus,
          updateLastPlayedAt,
        } = useMembers.getState();
        set((state) => {
          const updatedCourts = JSON.parse(JSON.stringify(state.courts));
          const court = updatedCourts[courtIndex];

          const playerIds = court.players
            .filter((p: Member | null): p is Member => p !== null)
            .map((p: Member) => p.id);

          if (playerIds.length > 0) {
            incrementPlayedTimes(playerIds);
            updateMembersStatus(playerIds, "idle");
            updateLastPlayedAt(playerIds);
          }

          court.players = [null, null, null, null];
          court.status = "idle";

          return { courts: updatedCourts };
        });
      },
    }),
    {
      name: "courts-storage",
    }
  )
);

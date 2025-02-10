// usePlayerStore.ts
import { create } from 'zustand';

import type { PlayerData, ZoneTransferRequest } from '@melo/types';

type PlayerStore = {
  players: PlayerData[];
  setPlayers: (newPlayers: PlayerData[]) => void;

  // Will be used to display a list of zone transfer requests for the players inside the room
  transferZoneRequests: ZoneTransferRequest[];
  setTransferZoneRequests: (newRequests: ZoneTransferRequest[]) => void;
  removeTransferZoneRequest: (requestId: string) => void;
  addTransferZoneRequest: (request: ZoneTransferRequest) => void;
};

const usePlayerStore = create<PlayerStore>((set) => ({
  players: [],
  setPlayers: (newPlayers) => set({ players: newPlayers }),

  transferZoneRequests: [],
  setTransferZoneRequests: (newRequests) => set({ transferZoneRequests: newRequests }),
  removeTransferZoneRequest: (requestId) => set((state) => ({
    transferZoneRequests: state.transferZoneRequests.filter((request) => request.requestId !== requestId),
  })),
  addTransferZoneRequest: (request) => set((state) => ({
    transferZoneRequests: [...state.transferZoneRequests, request],
  })),
}));

export default usePlayerStore;

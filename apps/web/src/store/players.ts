// usePlayerStore.ts
import { create } from 'zustand';

import type { PlayerData } from '@melo/types';

// Define the PlayerStore type
type PlayerStore = {
  players: PlayerData[];
  setPlayers: (newPlayers: PlayerData[]) => void;

  thisPlayerLiteralPosition: [number,number,number];
};

// Create the Zustand store
const usePlayerStore = create<PlayerStore>((set) => ({
  players: [],
  setPlayers: (newPlayers) => set({ players: newPlayers }),

  thisPlayerLiteralPosition: [0,0,0],
}));

export default usePlayerStore;

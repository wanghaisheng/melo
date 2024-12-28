// usePlayerStore.ts
import { create } from 'zustand';

import useGlobalStore from './global';
import Socket from "@/web/core/socket";

import type { PlayerData } from '@melo/types';

// Define the PlayerStore type
type PlayerStore = {
  players: PlayerData[];
  setPlayers: (newPlayers: PlayerData[]) => void;
};

// Create the Zustand store
const usePlayerStore = create<PlayerStore>((set, get) => ({
  players: [],
  setPlayers: (newPlayers) => set({ players: newPlayers }),
}));

export default usePlayerStore;

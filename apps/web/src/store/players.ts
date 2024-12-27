// usePlayerStore.ts
import { create } from 'zustand';

import useGlobalStore from './global';
import Socket from "@/web/core/socket";

import type { PlayerData } from '@melo/types';

// Define the PlayerStore type
type PlayerStore = {
  players: PlayerData[];
  setPlayers: (newPlayers: PlayerData[]) => void;
  handleUpdatePlayerData: (data: PlayerData) => void;
  getCurrentPlayer: () => PlayerData | void;
  handlePositionChange: (position: [number, number, number]) => void;
  handleDisplayNameChange: (displayName: string) => void;
};

// Create the Zustand store
const usePlayerStore = create<PlayerStore>((set, get) => ({
  players: [],
  setPlayers: (newPlayers) => set({ players: newPlayers }),

  // Method to update player data
  handleUpdatePlayerData: (data: PlayerData) => {
    const socket = useGlobalStore.getState().socket;
    if (!socket) return console.error("Socket is not initialized");

    // Emit the updated player data
    socket.emit("player-data-update", data);
  },

  // Get the current player based on the current socket ID
  getCurrentPlayer: () => {
    const { players } = get();
    const socket = useGlobalStore.getState().socket;
    if (!socket) return console.error("Socket is not initialized");

    const player = players.find(player => player.connectionId === socket.id);
    if (!player) return console.error("Current player not found");

    return player;
  },

  // Handle position change for the current player
  handlePositionChange: (position: [number, number, number]) => {
    const socket = useGlobalStore.getState().socket;
    if (!socket) return console.error("Socket is not initialized");

    // Get the current player data
    const player = get().getCurrentPlayer();
    if (!player) return;

    // Update the player position and emit the update
    get().handleUpdatePlayerData({
      ...player,
      position,
    });
  },

  // Handle display name change for the current player
  handleDisplayNameChange: (displayName: string) => {
    const player = get().getCurrentPlayer();
    if (!player) return;

    // Update the display name and emit the update
    get().handleUpdatePlayerData({
      ...player,
      displayName,
    });
  },
}));

export default usePlayerStore;

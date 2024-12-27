import { create } from "zustand";
import Socket from "../core/socket";

interface GlobalState {
  socket: Socket | null;
  setSocket: (socket: Socket | null) => void;
}

const useGlobalStore = create<GlobalState>((set) => ({
  socket: null,
  setSocket: (socket: Socket | null) => set({ socket }),
}));

export default useGlobalStore;
import { create } from "zustand";
import Socket from "../core/socket";

interface GlobalState {
  socket: Socket | null;
  setSocket: (socket: Socket | null) => void;
  modelsLoading: boolean;
  setModelsLoading: (_:boolean) => void;
}

const useGlobalStore = create<GlobalState>((set) => ({
  socket: null,
  setSocket: (socket: Socket | null) => set({ socket }),

  // Loading state to lock map controls while loading models
  modelsLoading: true, // True by default
  setModelsLoading: v => set({ modelsLoading: v})
}));

export default useGlobalStore;
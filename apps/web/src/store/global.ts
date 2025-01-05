import { create } from "zustand";
import Socket from "../core/socket";

interface GlobalState {
  socket: Socket | null;
  setSocket: (socket: Socket | null) => void;

  modelsLoading: boolean;
  setModelsLoading: (_:boolean) => void;

  // List of callbacks to call after the socket was initialized
  socketConnectCallbacks: {(socket: Socket): Promise<void>}[];
  addSocketConnectCallbacks: (cb: {(socket: Socket): Promise<void>}) => void;

  // Store the streaming devices ID to remember when toggling in-call
  videoDeviceId: string | null;
  audioDeviceId: string | null;
}

const useGlobalStore = create<GlobalState>((set) => ({
  socket: null,
  setSocket: (socket: Socket | null) => set({ socket }),

  // Loading state to lock map controls while loading models
  modelsLoading: true, // True by default
  setModelsLoading: v => set({ modelsLoading: v}),

  socketConnectCallbacks: [],
  addSocketConnectCallbacks: cb => set(prev => ({ socketConnectCallbacks: [...prev.socketConnectCallbacks, cb ]})),

  videoDeviceId: null,
  audioDeviceId: null,
}));

export default useGlobalStore;
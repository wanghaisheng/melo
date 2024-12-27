import { create } from 'zustand';

interface StreamsState {
  localStream: MediaStream | null;
  peersStream: Map<string, MediaStream | null>;
  loading: boolean;
  error: Error | null;
  setError: (error: Error | null) => void;
  cleanup: () => void;
}

export const useStreamsStore = create<StreamsState>((set, get) => ({
  localStream: null,
  peersStream: new Map(),
  loading: true,
  error: null,
  setError: (error) => set({ error }),
  cleanup: () => {
    const { localStream } = get();
    localStream?.getTracks().forEach(track => track.stop());
    set({ localStream: null, peersStream: new Map() });
  }
}));
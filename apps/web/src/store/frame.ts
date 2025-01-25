import { create } from "zustand";

interface FrameStore {
  thisPlayerLiteralPosition: [number,number,number];
}

const useFrameStore = create<FrameStore>(() => ({
  thisPlayerLiteralPosition: [0,0,0],
}));

export default useFrameStore;
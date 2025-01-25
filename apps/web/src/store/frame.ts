import { create } from "zustand";

// Frame store will be used to distribute rapidly changing data across components
// Rapidly changing data includes player position, player rotation, or changes in useFrame

interface FrameStore {
  thisPlayerLiteralPosition: [number,number,number];
}

const useFrameStore = create<FrameStore>(() => ({
  thisPlayerLiteralPosition: [0,0,0],
}));

export default useFrameStore;
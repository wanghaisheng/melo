import * as THREE from "three";
import { create } from "zustand";

interface SceneStore {
  lights: THREE.Object3D[];
  transferZones: THREE.Object3D[];

  setLights: (lights: THREE.Object3D[]) => void;
  setTransferZones: (doors: THREE.Object3D[]) => void;

  // The transfer zone the player is currently standing on
  playerCurrentTransferZone: THREE.Object3D | null;
}

const useSceneStore = create<SceneStore>((set) => ({
  lights: [],
  transferZones: [],
  setLights: (lights: THREE.Object3D[]) => set({ lights }),
  setTransferZones: (doors: THREE.Object3D[]) => set({ transferZones: doors }),

  playerCurrentTransferZone: null,
}));

export default useSceneStore;
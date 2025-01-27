import * as THREE from "three";
import { create } from "zustand";

interface SceneStore {
  lights: THREE.Object3D[];
  transferZones: THREE.Object3D[];

  setLights: (lights: THREE.Object3D[]) => void;
  setTransferZones: (doors: THREE.Object3D[]) => void;
}

const useSceneStore = create<SceneStore>((set) => ({
  lights: [],
  transferZones: [],
  setLights: (lights: THREE.Object3D[]) => set({ lights }),
  setTransferZones: (doors: THREE.Object3D[]) => set({ transferZones: doors }),
}));

export default useSceneStore;
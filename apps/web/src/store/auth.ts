import { create } from "zustand";

import type { User } from "firebase/auth"
import type { FirestoreAuthUserData } from "@melo/types";

export interface AuthSession {
  user: User | null,
  status: "auth" | "anon",
  data: FirestoreAuthUserData | null,
}

const __authDefaultValue : AuthSession = {
  user: null,
  status: "anon",
  data: null,
}


interface AuthStore {
  auth: AuthSession | null,
  setAuth: (auth: AuthSession | null) => void; 
  resetAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  auth: null,
  setAuth: auth => set({ auth }),
  resetAuth: () => set({ auth: __authDefaultValue })
}))
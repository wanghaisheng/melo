import { create } from "zustand";

import type { User } from "firebase/auth"

interface AuthSession {
  user: User | null,
  status: "auth" | "anon",
}

const __authDefaultValue : AuthSession = {
  user: null,
  status: "anon",
}


interface AuthStore {
  auth: AuthSession | null,
  setAuth: (auth: AuthSession | null) => void; 
  resetAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  auth: null,
  setAuth: auth => set({ auth }),
  resetAuth: () => set({ auth: __authDefaultValue })
}))
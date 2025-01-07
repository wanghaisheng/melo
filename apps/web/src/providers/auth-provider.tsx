"use client";

import { fireauth } from "@/web/firebase/init";
import type { User } from "firebase/auth"
import { createContext, useContext, useEffect, useState } from "react"

interface AuthContext {
  user: User | null,
  status: "auth" | "anon",
}

const __authDefaultValue : AuthContext = {
  user: null,
  status: "anon",
}

// Start out with an anonymous(signed-out) context
const authContext = createContext<AuthContext>(__authDefaultValue);

export const useAuth = () => useContext(authContext);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode,
}) {
  const [auth, setAuth] = useState(__authDefaultValue);

  useEffect(() => {
    fireauth.onAuthStateChanged(user => {
      if ( user ) {
        setAuth({
          user: user,
          status: "auth",
        });
      } else {
        setAuth(__authDefaultValue);
      }
    })
  }, []);
  
  return <authContext.Provider value={auth}>
    {children}
  </authContext.Provider>
}
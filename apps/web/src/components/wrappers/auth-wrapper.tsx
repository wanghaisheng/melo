"use client";

import { DASHBOARD_PAGE_URL, REDIRECT_LOGIN_PAGE_URL } from "@/web/env";
import { fireauth } from "@/web/firebase/init";
import { useAuthStore } from "@/web/store/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode,
}) {
  const {
    setAuth,
    resetAuth,
    auth
  } = useAuthStore();

  useEffect(() => {
    fireauth.onAuthStateChanged(user => {
      if ( user ) {
        setAuth({
          user: user,
          status: "auth",
        });
      } else {
        resetAuth();
      }
    })

  }, []);

  /** REDIRECTION LOGIC IF NO USER IS PRESENT */
  const urlpathname = usePathname();
  const router = useRouter();
  
  useEffect(() => {
    if ( auth?.status === "auth" && urlpathname.startsWith("/auth")) {
      router.push(DASHBOARD_PAGE_URL);
    }
  }, [auth]);

  /** SHOW AUTHENTICATION LOADING WIDGET IF THE FIREBASE IS STILL GETTING THE USER */
  if ( auth === null ) {
    return null;
  }

  if ( auth.status === "anon" && !urlpathname.startsWith("/auth") ) {
    // To preven the bad set-state error
    setTimeout(() => {
      router.push(REDIRECT_LOGIN_PAGE_URL);
    });
    return; 
  }
  
  return children;
}
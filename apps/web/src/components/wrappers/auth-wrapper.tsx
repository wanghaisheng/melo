"use client";

import { DASHBOARD_PAGE_URL, REDIRECT_LOGIN_PAGE_URL } from "@/web/env";
import { fireauth, firestore } from "@/web/firebase/init";
import AuthHelpers from "@/web/helpers/auth";
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
    fireauth.onAuthStateChanged(async user => {
      if ( user ) {
        // Try to get the auth user data from firestore
        const firestoreUser = await AuthHelpers.tryGetExistingUserFromFirestore(firestore, user.uid);

        if (!firestoreUser) return console.error("Couldn't find user data for the current user in firestore.")
        
        setAuth({
          user: user,
          status: "auth",
          data: firestoreUser,
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
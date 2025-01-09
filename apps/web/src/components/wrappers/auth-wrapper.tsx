"use client";

import Image from "next/image";
import { DASHBOARD_PAGE_URL } from "@/web/env";
import { fireauth } from "@/web/firebase/init";
import { useAuthStore } from "@/web/store/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { BackgroundShapes } from "@melo/ui/background-shapes";

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
    return <div className="h-screen w-screen absolute">
      <BackgroundShapes count={40} />
      <div className="h-screen w-screen backdrop-blur-sm flex flex-col justify-center items-center absolute">
        <Image src="static/melo.svg" alt="Melo Logo" height={800} width={800} />
        <h1 className="text-4xl font-bold">Fetching Authentication ...</h1>
        <span className="text-lg text-gray-700">Hang tight! The server is fetching user data</span>
      </div>
    </div>
  }
  
  return children;
}
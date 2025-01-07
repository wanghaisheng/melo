import { fireauth } from "@/web/firebase/init";
import { useAuthStore } from "@/web/store/auth";
import { useEffect } from "react";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode,
}) {
  const {
    setAuth,
    resetAuth
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
  
  return children;
}
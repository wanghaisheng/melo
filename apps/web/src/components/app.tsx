"use client";

import AuthWrapper from "@/web/components/wrappers/auth-wrapper";
import { Toaster } from "@melo/ui/ui/toaster";
import type React from "react";

export default function App({
  children,
}: {
  children: React.ReactNode,
}) {

  return <>
    <Toaster />
    <AuthWrapper>
      {children}
    </AuthWrapper>
  </>;
}
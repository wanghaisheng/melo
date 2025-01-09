"use client";

import DashboardSidebar from "@/web/components/dashboard/sidebar";
import { useAuthStore } from "@/web/store/auth";
import { SidebarProvider } from "@melo/ui/ui/sidebar";

export default function Layout({
  children
}:{
  children: React.ReactNode,
}) {
  const { auth } = useAuthStore();

  if (!auth || !auth.user) return null;
  
  return (
    <main className="h-screen w-screen flex">
      <SidebarProvider>
        <DashboardSidebar />
        { children }
      </SidebarProvider>
    </main>
  );
}
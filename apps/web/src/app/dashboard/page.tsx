"use client";

import UserCard from "@/web/components/dashboard/sidebar/user-card";
import { useAuthStore } from "@/web/store/auth";
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider } from "@melo/ui/ui/sidebar";


export default function DashboardPage() {
  const {
    auth,
  } = useAuthStore();
  
  if ( !auth || !auth.user ) return;
  
  return <main className="h-screen w-screen">
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <UserCard auth={auth}/>
        </SidebarHeader>
      </Sidebar>
    </SidebarProvider>
  </main>
}
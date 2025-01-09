"use client";

import { useState } from "react";
import UserCard from "@/web/components/dashboard/sidebar/user-card";
import { useAuthStore } from "@/web/store/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
} from "@melo/ui/ui/sidebar";
import { HelpCircle, Settings, Users, PlusCircle, ChevronRight } from 'lucide-react';

export const joinedOrganizations = [
  {
    id: '1',
    name: 'Acme Corp',
    rooms: [
      { id: '101', name: 'General' },
      { id: '102', name: 'Engineering' },
      { id: '103', name: 'Marketing' },
    ],
  },
  {
    id: '2',
    name: 'Globex Inc',
    rooms: [
      { id: '201', name: 'Main Hall' },
      { id: '202', name: 'Product Team' },
      { id: '203', name: 'Customer Support' },
    ],
  },
];



export default function DashboardPage() {
  const { auth } = useAuthStore();
  const [activeRoom, setActiveRoom] = useState<string | null>(null);

  if (!auth || !auth.user) return null;

  return (
    <main className="h-screen w-screen">
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <UserCard auth={auth} />
          </SidebarHeader>
          <SidebarContent>
            {joinedOrganizations.map((org) => (
              <SidebarGroup key={org.id}>
                <SidebarGroupLabel>{org.name}</SidebarGroupLabel>
                <SidebarGroupAction>
                  <ChevronRight size={14} />
                </SidebarGroupAction>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {org.rooms.map((room) => (
                      <SidebarMenuItem key={room.id}>
                        <SidebarMenuButton
                          asChild
                          isActive={activeRoom === room.id}
                          onClick={() => setActiveRoom(room.id)}
                        >
                          <a href={`#${room.id}`}>{room.name}</a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}

            <SidebarSeparator />

            <SidebarGroup>
              <SidebarGroupLabel>Actions</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#join-org">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Join Organization
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#create-room">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Room
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator />

            <SidebarGroup>
              <SidebarGroupLabel>General</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#people">
                        <Users className="mr-2 h-4 w-4" />
                        People
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#help">
                        <HelpCircle className="mr-2 h-4 w-4" />
                        Help & Support
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </main>
  );
}


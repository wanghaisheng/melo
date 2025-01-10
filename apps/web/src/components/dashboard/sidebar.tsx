import UserCard from "@/web/components/dashboard/sidebar/user-card";
import { DASHBOARD_PAGE_URL } from "@/web/env";
import { useAuthStore } from "@/web/store/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
} from "@melo/ui/ui/sidebar";
import { HelpCircle, Settings, Users, PlusCircle, ChevronRight, Phone, DoorClosed, Home } from 'lucide-react';
import Link from "next/link";

export default function DashboardSidebar() {
  const { auth } = useAuthStore();
  
  return (
  <Sidebar collapsible="icon">
    <SidebarHeader>
      <UserCard auth={auth!} />
    </SidebarHeader>
    <SidebarContent>
      {/* {joinedOrganizations.map((org) => (
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
                  >
                    <a href={`#${room.id}`}>{room.name}</a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))} */}

      {/* <SidebarSeparator /> */}

      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={DASHBOARD_PAGE_URL}>
                  <Home className="mr-2 h-4 w-4"/>
                  Dashboard
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Room Actions</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={`${DASHBOARD_PAGE_URL}/create-room/`}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Room
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="#join-room">
                  <DoorClosed className="mr-2 h-4 w-4" />
                  Join Existing Room
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#call-history">
                  <Phone className="mr-2 h-4 w-4" />
                  Call History
                </Link>
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
  );
}
import React from "react";

import MeloRoomHelpers from "@/web/helpers/room";
import { firestore } from "@/web/firebase/init";
import { notFound } from "next/navigation";
import PasswordProtection from "@/web/components/room/components/initialization/components/password-protection";

interface PasswordProtectionWrapperProps {
  children: React.ReactNode;
  room: string;
}

// NOTE: I know that the password should have been hashed in the server 
// However, my primary focus is on the virtual space application itself.

// Check if the room is password protected
export default async function PasswordProtectionWrapper({ children, room } : PasswordProtectionWrapperProps) {
  const roomData = await MeloRoomHelpers.tryGetRoom(firestore, room);

  if (!roomData) {
    return notFound();
  }

  console.log(roomData);

  if (roomData.hasPassword) {
    return <PasswordProtection room={roomData}>
      { children }
    </PasswordProtection>
  }

  return children;
}
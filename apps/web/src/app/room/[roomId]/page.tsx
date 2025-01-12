import PasswordProtectionWrapper from "@/web/components/room/components/initialization/password-protection-wrapper";
import Room from "@/web/components/room/room";
import { firestore } from "@/web/firebase/init";
import MeloRoomHelpers from "@/web/helpers/room";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{
    roomId: string,
  }>
}) {
  const { roomId } = await params;

  // Check if the rooms exist
  const room = await MeloRoomHelpers.tryGetRoom(firestore, roomId);
  if ( !room ) {
    return notFound();
  }
  
  return <PasswordProtectionWrapper room={roomId}>
    <Room roomId={roomId}/>
  </PasswordProtectionWrapper>
}
"use client";

import ChatLogs from "@/web/components/room/components/chat-logs";
import PlayersProvider from "@/web/components/room/components/context-providers/players";
import ConnectSocket from "@/web/components/room/components/initialization/connect-socket";
import SocketConnection from "@/web/components/room/components/initialization/socket";
import StreamsProvider from "@/web/components/room/components/context-providers/streams";
import Level from "@/web/components/room/components/level";
import VideoSection from "@/web/components/room/components/user/video-section";
import Controls from "@/web/components/room/components/user/controls";
import { useAuthStore } from "@/web/store/auth";
import UserCard from "@/web/components/dashboard/sidebar/user-card";
import TransferZoneControls from "@/web/components/room/components/user/transfer-zone-controls";

export default function Room({
  roomId,
}: {
  roomId: string,
}) {
  const { auth } = useAuthStore();

  if ( !auth || !auth.user) return;

  return (
    <div className=" w-screen h-screen relative bg-white">
      <div className="absolute z-50 p-2">
          <UserCard auth={auth} />
      </div>
      
        <SocketConnection room={roomId}>
          <StreamsProvider>
            <PlayersProvider>
              <ConnectSocket>
                <Controls />
                <TransferZoneControls />
                <VideoSection />
                <ChatLogs />
                <Level />
              </ConnectSocket>
            </PlayersProvider>
          </StreamsProvider>
        </SocketConnection>
    </div>
  );
}
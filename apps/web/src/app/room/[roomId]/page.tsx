"use client";

import { useParams } from "next/navigation";

import ChatLogs from "@/web/components/room/components/chat-logs";
import PlayersProvider from "@/web/components/room/components/context-providers/players";
import ConnectSocket from "@/web/components/room/components/initialization/connect-socket";
import SocketConnection from "@/web/components/room/components/initialization/socket";
import StreamsProvider from "@/web/components/room/components/context-providers/streams";
import Level from "@/web/components/room/components/level";
import VideoSection from "@/web/components/room/components/user/video-section";
import Controls from "@/web/components/room/components/user/controls";

export default function Page() {

  const params = useParams<{ roomId: string }>();

  return (
    <div className="w-screen h-screen relative bg-white">
      <SocketConnection room={params.roomId}>
        <StreamsProvider>
          <PlayersProvider>
            <ConnectSocket>
              <Controls />
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
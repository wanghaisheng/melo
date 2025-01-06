"use client";

import ChatLogs from "@/web/app/room/components/chat-logs";
import PlayersProvider from "@/web/app/room/components/context-providers/players";
import ConnectSocket from "@/web/app/room/components/initialization/connect-socket";
import SocketConnection from "@/web/app/room/components/initialization/socket";
import StreamsProvider from "@/web/app/room/components/context-providers/streams";
import Level from "@/web/app/room/components/level";
import VideoSection from "@/web/app/room/components/user/video-section";
import { useParams } from "next/navigation";

export default function Page() {

  const params = useParams<{ roomId: string }>();

  return (
    <div className="w-screen h-screen relative bg-white">
      <SocketConnection room={params.roomId}>
        <StreamsProvider>
          <PlayersProvider>
            <ConnectSocket>
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
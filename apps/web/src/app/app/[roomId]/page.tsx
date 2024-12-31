"use client";

import ChatLogs from "@/web/app/app/components/chat-logs";
import PlayersProvider from "@/web/app/app/components/context-providers/players";
import ConnectSocket from "@/web/app/app/components/initialization/connect-socket";
import SocketConnection from "@/web/app/app/components/initialization/socket";
import StreamsProvider from "@/web/app/app/components/context-providers/streams";
import Level from "@/web/app/app/components/level";
import VideoSection from "@/web/app/app/components/video-section";
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
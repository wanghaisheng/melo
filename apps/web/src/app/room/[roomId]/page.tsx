"use client";

import { useParams } from "next/navigation";

import ChatLogs from "@/web/app/room/_components/chat-logs";
import PlayersProvider from "@/web/app/room/_components/context-providers/players";
import ConnectSocket from "@/web/app/room/_components/initialization/connect-socket";
import SocketConnection from "@/web/app/room/_components/initialization/socket";
import StreamsProvider from "@/web/app/room/_components/context-providers/streams";
import Level from "@/web/app/room/_components/level";
import VideoSection from "@/web/app/room/_components/user/video-section";
import Controls from "@/web/app/room/_components/user/controls";

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
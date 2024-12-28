"use client";

import ChatLogs from "@/web/app/app/components/chat-logs";
import PlayersProvider from "@/web/app/app/components/context-providers/players";
import ConnectSocket from "@/web/app/app/components/initialization/connect-socket";
import SocketConnection from "@/web/app/app/components/initialization/socket";
import Streams from "@/web/app/app/components/initialization/streams";
import Level from "@/web/app/app/components/level";
import VideoSection from "@/web/app/app/components/video-section";

export default function Page() {
  
  return (
    <div className="w-screen h-screen relative bg-white">
      <SocketConnection>
        <Streams>
          <PlayersProvider>
            <ConnectSocket>
                <VideoSection />
                <ChatLogs />
                <Level />
            </ConnectSocket>
          </PlayersProvider>
        </Streams>
      </SocketConnection>
    </div>
  );
}
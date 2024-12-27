"use client";

import PlayersProvider from "@/web/app/app/components/context-providers/players";
import SocketConnection from "@/web/app/app/components/initialization/socket";
import Streams from "@/web/app/app/components/initialization/streams";
import Level from "@/web/app/app/components/level";
import VideoSection from "@/web/app/app/components/video-section";

export default function Page() {
  
  return (
    <SocketConnection>
      <Streams>
        <PlayersProvider>
          <div className="w-screen h-screen relative">
            <VideoSection />
            <Level />
          </div>
        </PlayersProvider>
      </Streams>
    </SocketConnection>
  );
}
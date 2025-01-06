import VideoStream from "@/web/app/room/components/video-stream";
import useGlobalStore from "@/web/store/global";
import usePlayerStore from "@/web/store/players";
import { useStreamsStore } from "@/web/store/streams";

export default function VideoSection() {
  const { localStream } = useStreamsStore();
  const { socket } = useGlobalStore();
  const { players } = usePlayerStore();
  
  const thisPlayer = players.find(player => player.connectionId === socket!.id);
  return (
    <div className="absolute right-2 top-2 flex flex-col items-end gap-2 z-10">
      {/* Local Video Stream */}
      <div className="relative w-52 h-32 rounded-lg overflow-hidden border-2">
        <VideoStream 
          stream={localStream} 
          isLocal 
          playerPosition={[0,0,0]} 
          userPosition={[0,0,0]} 
          disableDynamicVolume
          disabled={!thisPlayer!.video}
        />
      </div>
    </div>
  )
}
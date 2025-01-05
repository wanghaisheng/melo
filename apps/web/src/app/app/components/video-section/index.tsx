import { useStreams } from "@/web/app/app/components/context-providers/streams";
import VideoStream from "@/web/app/app/components/video-stream";
import { Button } from "@/web/components/ui/button";
import useGlobalStore from "@/web/store/global";
import usePlayerStore from "@/web/store/players";
import { useStreamsStore } from "@/web/store/streams";
import { Camera, CameraOff, Mic, MicOff } from "lucide-react";

export default function VideoSection() {
  const {
    localStream,
    isVideoEnabled, 
    isAudioEnabled,
    toggleLocalVideo,
    toggleLocalAudio,
  } = useStreamsStore();
  const { socket } = useGlobalStore();
  const { peersRef } = useStreams();
  const { players } = usePlayerStore();
    
  const handleToggleVideo = async () => {
    if (!socket) return console.error("Socket is missing while toggling camera");
    toggleLocalVideo(peersRef.current, socket);
  }

  const handleToggleAudio = async () => {
    if (!socket) return console.error("Socket is missing while toggling camera");
    toggleLocalAudio(peersRef.current, socket);
  }
  
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
      {/* Local Stream Controls */}
      <div className="flex gap-2 ">
        <Button onClick={handleToggleAudio}>
          {
            isAudioEnabled ? <Mic /> : <MicOff />
          }
        </Button>
        <Button onClick={handleToggleVideo}>
          {
            isVideoEnabled ? <Camera /> : <CameraOff />
          }
        </Button>
      </div>
    </div>
  )
}
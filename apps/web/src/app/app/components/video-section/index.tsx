import { useStreams } from "@/web/app/app/components/context-providers/streams";
import VideoStream from "@/web/app/app/components/video-stream";
import { Button } from "@/web/components/ui/button";
import { useStreamsStore } from "@/web/store/streams";
import { Camera, CameraOff, Mic, MicOff } from "lucide-react";

export default function VideoSection() {
  const {
    localStream,
    isVideoEnabled, 
    toggleLocalVideo,
  } = useStreamsStore();
  
  // const localHasVideo = localStream?.getVideoTracks().length ?? false;
  // const localHasAudio = localStream?.getAudioTracks().length ?? false;

  const { peersRef } = useStreams();
    
  const handleToggleVideo = async () => {
    toggleLocalVideo(peersRef.current);
  }
  
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
          disabled={!isVideoEnabled}
        />
      </div>
      {/* Local Stream Controls */}
      <div className="flex gap-2 ">
        <Button>
          {
            false ? <Mic /> : <MicOff />
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
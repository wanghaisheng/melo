import VideoStream from "@/web/app/app/components/video-stream";
import { useStreamsStore } from "@/web/store/streams";

export default function VideoSection() {
  const {
    localStream,
  } = useStreamsStore();
  
  return (
    <div className="absolute right-2 top-2 flex flex-col items-end gap-2 z-10">
      {/* Local Video Stream */}
      <div className="relative w-52 h-32 rounded-lg overflow-hidden border-2">
        <VideoStream stream={localStream} isLocal playerPosition={[0,0,0]} userPosition={[0,0,0]} disableDynamicVolume/>
      </div>
    </div>
  )
}
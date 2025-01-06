import { useStreams } from "@/web/app/room/components/context-providers/streams";
import { Button } from "@/web/components/ui/button";
import ToggleIconButton from "@/web/components/ui/toggle-icon-button";
import { cn } from "@/web/lib/utils";
import useGlobalStore from "@/web/store/global";
import { useStreamsStore } from "@/web/store/streams"

import { Mic, MicOff, Camera, CameraOff } from "lucide-react";

/**
 * @description The bar at the bottom-center of the application
 */
export default function Controls() {
  const { socket } = useGlobalStore();
  const { peersRef } = useStreams();
  const {
    isAudioEnabled,
    isVideoEnabled,
    toggleLocalAudio,
    toggleLocalVideo,
  } = useStreamsStore();
  
  return <div className="
      absolute bottom-4 z-10 
      left-1/2 -translate-x-1/2

      h-12 w-96 
      rounded-full px-3 

      bg-zinc-800  
      text-white

      flex items-center gap-3
  ">
    <ToggleIconButton
      disabled={!isAudioEnabled}
      on={<Mic />}
      off={<MicOff />}
      onClick={() => toggleLocalAudio(peersRef.current!, socket!)}
    />
    <ToggleIconButton
      disabled={!isVideoEnabled}
      on={<Camera />}
      off={<CameraOff />}
      onClick={() => toggleLocalVideo(peersRef.current!, socket!)}
    />
  </div>
}
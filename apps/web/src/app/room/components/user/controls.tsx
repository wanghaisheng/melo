import { useStreams } from "@/web/app/room/components/context-providers/streams";
import ToggleIconButton from "@melo/ui/ui/toggle-icon-button";
import useGlobalStore from "@/web/store/global";
import { useStreamsStore } from "@/web/store/streams"

import { Mic, MicOff, Camera, CameraOff, Phone, GripVertical, Settings } from "lucide-react";

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
      tip="Toggle Audio"
      disabled={!isAudioEnabled}
      on={<Mic />}
      off={<MicOff />}
      onClick={() => toggleLocalAudio(peersRef.current!, socket!)}
    />
    <ToggleIconButton
      tip="Toggle Video"
      disabled={!isVideoEnabled}
      on={<Camera />}
      off={<CameraOff />}
      onClick={() => toggleLocalVideo(peersRef.current!, socket!)}
    />
    <div className="ml-auto flex items-center gap-2">
      <ToggleIconButton
        tip="Settings"
        className="bg-transparent hover:bg-zinc-500 hover:text-white"
        disabled={false}
        on={<Settings/>}
        off={<></>}
        onClick={() => {}}
      />
      <GripVertical size={16} className="text-zinc-500" />
      <ToggleIconButton
        tip="Exit Space"
        className="bg-rose-500 hover:bg-rose-600 hover:text-white"
        disabled={false}
        on={<Phone className="rotate-[135deg]" />}
        off={<></>}
        onClick={() => {}}
      />
    </div>
  </div>
}
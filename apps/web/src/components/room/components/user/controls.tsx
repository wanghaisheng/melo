import { useStreams } from "@/web/components/room/components/context-providers/streams";
import { DASHBOARD_PAGE_URL } from "@/web/env";
import useGlobalStore from "@/web/store/global";
import { useStreamsStore } from "@/web/store/streams"
import { WebSocketEvents } from "@melo/common/constants";
import ToggleIconButton from "@melo/ui/toggle-icon-button";

import { Mic, MicOff, Camera, CameraOff, Phone, GripVertical, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

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
    localStream,
  } = useStreamsStore();

  const router = useRouter();

  const handleRoomExit = () => {
    socket?.emit(WebSocketEvents.USER_DISCONNECT, {});
    localStream?.getTracks().forEach(t => t.stop());
    router.replace(DASHBOARD_PAGE_URL);
  }
  
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
        onClick={handleRoomExit}
      />
    </div>
  </div>
}
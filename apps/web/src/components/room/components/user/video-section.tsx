import React from 'react';
import VideoStream from "@/web/components/room/components/video-stream";
import useGlobalStore from "@/web/store/global";
import usePlayerStore from "@/web/store/players";
import { useStreamsStore } from "@/web/store/streams";
import { Vector3 } from 'three';

const PROXIMITY_THRESHOLD = 1.8;

export default function VideoSection() {
  const { localStream, peersStream } = useStreamsStore();
  const { socket } = useGlobalStore();
  const { players } = usePlayerStore();
  
  const thisPlayer = players.find(player => player.connectionId === socket?.id);
  
  if (!thisPlayer) return null;

  const nearbyPlayers = players.filter(player => {
    if (player.connectionId === thisPlayer.connectionId) return false;
    if (!player.video) return false; // Skip players with video disabled
    
    // Also skip players if they are not in the same zone
    if (player.zone !== thisPlayer.zone) return false;
    
    const distance = (new Vector3(...player.position).distanceToSquared(new Vector3(...thisPlayer.position)));
    return distance <= PROXIMITY_THRESHOLD * PROXIMITY_THRESHOLD;
  });

  return (
    <div className="absolute right-2 top-2 flex flex-col items-end gap-2 z-10 h-[100% - 0.5rem] select-none">
      {/* Local Video Stream */}
      <div className="relative w-52 h-32 rounded-lg overflow-hidden border-2">
        <VideoStream 
          stream={localStream} 
          isLocal 
          playerPosition={thisPlayer.position}
          userPosition={thisPlayer.position}
          disableDynamicVolume
          hasVideo={thisPlayer.video}
          hasAudio={false}
        />
      </div>

      {/* Nearby Players' Video Streams */}
      {nearbyPlayers.slice(0,3).map(player => (
        <div 
          key={player.connectionId}
          className="relative w-52 h-32 rounded-lg overflow-hidden border-2"
        >
          <VideoStream 
            stream={peersStream.get(player.connectionId) || null}
            isLocal={false}
            playerPosition={player.position}
            userPosition={thisPlayer.position}
            hasVideo={player.video}
            hasAudio={player.audio && player.zone === thisPlayer.zone}
            disableDynamicVolume
          />
          <div className="absolute bottom-1 left-1 text-white text-sm bg-black/50 px-2 py-1 rounded">
            {player.displayName}
          </div>
        </div>
      ))}
    </div>
  );
}
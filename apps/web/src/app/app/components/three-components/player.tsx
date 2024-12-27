import { Html } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import { useThree, useFrame } from "@react-three/fiber";
import { useState } from "react";

import { PlayerData } from "@melo/types";
import VideoStream from "@/web/app/app/components/video-stream";

interface PlayerProps {
  stream: MediaStream | null;
  isLocal: boolean;
  player: PlayerData;
  userPosition: [number, number, number];
}

export default function Player({
  stream,
  player,
  isLocal,
  userPosition,
}: PlayerProps) {
  const [size, setSize] = useState(2.5);
  const { camera } = useThree();

  const { position } = useSpring({
    position: player.position,
    config: {
      mass: 1,
      tension: 170,
      friction: 26
    }
  });

  const calculateSizeFromZoom = (zoom: number) => {
    return (1/35) * zoom - (1/14);
  };

  // Update size every frame to respond to zoom changes
  useFrame(() => {
    const newSize = calculateSizeFromZoom(camera.zoom);
    if (Math.abs(newSize - size) > 0.01) { // Only update if change is significant
      setSize(newSize);
    }
  });

  return (
    <animated.mesh 
      key={player.connectionId}
      castShadow
      position={position}
    >
      <Html 
        position={[0,0,0]} 
        style={{
          pointerEvents: "none",
          transition: "all 0.1s ease-out" // Optional: smooth size changes
        }}
      >
        <div 
          style={{
            height: `${size}rem`,
            width: `${size}rem`,
          }}
          className={`
              -z-10 -translate-x-1/2 -translate-y-[100%] 
              border-2 ${isLocal ? "border-pink-400" : "border-white"} 
              rounded-xl 
              overflow-hidden
              `}
        >
          <VideoStream 
            stream={stream} 
            isLocal={isLocal} 
            hideName 
            userPosition={userPosition}
            playerPosition={player.position}
          />
        </div>
      </Html>
    </animated.mesh>
  );
}
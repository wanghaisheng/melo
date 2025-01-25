import { Html } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import type { PlayerData } from "@melo/types";
import VideoStream from "@/web/components/room/components/video-stream";
// import usePlayerStore from "@/web/store/players";
import useFrameStore from "@/web/store/frame";

interface PlayerProps {
  stream: MediaStream | null;
  isLocal: boolean;
  player: PlayerData;
  userPosition: [number, number, number];
}

const PLAYER_MOVEMENT_SPEED = 4;

export default function Player({
  stream,
  player,
  isLocal,
  userPosition,
}: PlayerProps) {
  const [size, setSize] = useState(2.5);
  const { camera } = useThree();

  const meshRef = useRef<THREE.Mesh>(null);
  const currentPosition = useRef(new THREE.Vector3(...player.position));
  const targetPosition = useRef(new THREE.Vector3(...player.position));

  if (!targetPosition.current.equals(new THREE.Vector3(...player.position))) {
    targetPosition.current.set(...player.position);
  }
  
  const calculateSizeFromZoom = (zoom: number) => {
    return (1/35) * zoom - (1/14);
  };

  useEffect(() => {
    if ( meshRef.current ) {
      meshRef.current.position.set(...player.position);
    }
  }, []);
  
  useFrame((_, delta) => {
    if ( meshRef.current ) {
      const direction = new THREE.Vector3().subVectors(targetPosition.current, currentPosition.current);
      const distance = direction.length();

      if ( distance > 0.05 ) {
        direction.normalize();
        const movement = Math.min(PLAYER_MOVEMENT_SPEED * delta, distance);
        currentPosition.current.add(direction.multiplyScalar(movement));
        meshRef.current.position.copy(currentPosition.current);

        if ( isLocal ) {
          useFrameStore.setState({
            thisPlayerLiteralPosition: [
              currentPosition.current.x,
              currentPosition.current.y,
              currentPosition.current.z,
            ]
          });
        }
      }
    }    
    
    // Update size every frame to respond to zoom changes
    const newSize = calculateSizeFromZoom(camera.zoom);
    if (Math.abs(newSize - size) > 0.01) { // Only update if change is significant
      setSize(newSize);
    }
  });

  return (
    //@ts-ignore
    <group 
      ref={meshRef}
      key={player.connectionId}
      castShadow
    >
      <Html 
        style={{
          pointerEvents: "none",
          transition: "all 0.1s ease-out", // Optional: smooth size changes
        }}
        zIndexRange={[0,10]}
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
              `}
        >
          <VideoStream 
            stream={stream} 
            isLocal={isLocal} 
            hideName 
            userPosition={userPosition}
            playerPosition={player.position}
            hasVideo={player.video}
            hasAudio={player.audio}
          />
        </div>
      </Html>
    {/* @ts-ignore */}
    </group>
  );
}
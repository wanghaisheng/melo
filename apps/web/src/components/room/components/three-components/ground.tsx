import { useState } from "react";
import { ThreeEvent } from "@react-three/fiber";

import { usePlayers } from "@/web/app/room/_components/context-providers/players";
import checkMobilePlatform from "@/web/core/mobile";

import Pointer from "./pointer";

function Ground() {
  const [cursorPosition, setCursorPosition] = useState<[number,number,number] | null>(null);
  const [showCursor, setShowCursor] = useState(false);

  const { handlePositionChange } = usePlayers();
  
  const handlePointerDown = (event: ThreeEvent<MouseEvent>) => {
    // Stop propagation to prevent HTML elements from intercepting
    event.stopPropagation();

    // Enable mouse button if the platform is mobile(touch-controlled)
    if ( !checkMobilePlatform() && event.button !== 2 ) return;
    
    // Check if the click is directly on the ground mesh
    if (event.object.type === "Mesh") {
      handlePositionChange([event.point.x, event.point.y, event.point.z]);
    }
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    // Only update cursor if we're interacting with the ground mesh
    if (!showCursor) setShowCursor(true);
    
    setCursorPosition([
      event.point.x,
      event.point.y,
      event.point.z,
    ]);
  };

  return <>
    <mesh 
      onPointerDown={handlePointerDown}
      onDoubleClick={handlePointerDown}
      onPointerLeave={() => setShowCursor(false)}
      onPointerMove={handlePointerMove}
      position={[0,-1,0]}
    >
      <boxGeometry args={[100,2.35,100]} />
      <meshStandardMaterial color="#3B8B5D" />
    </mesh>
    {
      showCursor && <Pointer 
        cursorPosition={cursorPosition}
      />
    }
  </> 
}

export default Ground;
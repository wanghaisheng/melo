import { useEffect, useRef, useState } from "react";
import { type ThreeEvent } from "@react-three/fiber";

// import { usePlayers } from "@/web/components/room/components/context-providers/players";
import * as THREE from "three";
import { Pathfinding } from "three-pathfinding";
import { useGLTF } from "@react-three/drei";

const MOUSE_MOVE_THRESHOLD_DIST = 0.01;
const NAVMESH_MESH_NAME_PREFIX = "NavMesh_";

function Ground() {
  const [_, setCursorPosition] = useState<[number,number,number] | null>(null);
  const [showCursor, setShowCursor] = useState(false);

  // const { handlePositionChange } = usePlayers();

  // This will be used to track mouse movement to determine if the click was
  // for moving the screen or the player
  const mouse = useRef<THREE.Vector2>(new THREE.Vector2());
  const mouseDown = useRef<THREE.Vector2>(new THREE.Vector2());

  // Navigation
  const { scene: navMeshScene } = useGLTF("/static/navmesh.glb");
  
  const [ navMeshGeometries, setNavMeshGeometries ] = useState<THREE.BufferGeometry[]>([]);
  const navMeshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const navMeshGroupRef = useRef<THREE.Group | null>(null);
  const raycaster = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const pathfinder = useRef<Pathfinding>(new Pathfinding());
  const targetPosition = useRef<THREE.Vector3>(new THREE.Vector3());
  const path = useRef<THREE.Vector3[]>([]);
  const groupID = useRef<number | null>(null);
  const zoneID = useRef<number | null>(null);

  useEffect(() => {
    const navmeshes: THREE.BufferGeometry[] = [];

    navMeshScene.traverse(o => {
      if ( o.type === "Mesh" && o.name.startsWith(NAVMESH_MESH_NAME_PREFIX) ) {
        navmeshes.push((o as THREE.Mesh).geometry);
      }
    });

    setNavMeshGeometries(navmeshes);
  }, [navMeshScene]);

  useEffect(() => {
    /** SETUP NAVIGATION ZONES */
    navMeshGeometries.forEach(mesh => {
      const zoneName = mesh.name.split("_")[1];
      const zone = Pathfinding.createZone(mesh);
      pathfinder.current.setZoneData(zoneName, zone);
    })
  }, [navMeshGeometries]);

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    // Only update cursor if we're interacting with the ground mesh
    if (!showCursor) setShowCursor(true);
    
    setCursorPosition([
      event.point.x,
      event.point.y,
      event.point.z,
    ]);
  };

  const handlePointerDown = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();

    // Clamping the values between [-1, 1]
    mouseDown.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseDown.current.y = (e.clientY / window.innerHeight) * 2 + 1;
  }
  
  const handlePointerUp = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    
    mouseDown.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseDown.current.y = (e.clientY / window.innerHeight) * 2 + 1;
    
    if (
      Math.abs(mouse.current.x - mouseDown.current.x) > MOUSE_MOVE_THRESHOLD_DIST ||
      Math.abs(mouse.current.y - mouseDown.current.y) > MOUSE_MOVE_THRESHOLD_DIST
    ) return; // If the mouse has moved ignore the player move
  }

  return <>
    <mesh 
      onPointerLeave={() => setShowCursor(false)}
      onPointerMove={handlePointerMove}
      position={[0,-1,0]}
    >
      <boxGeometry args={[100,2.35,100]} />
      <meshStandardMaterial color="#3B8B5D" />
    </mesh>
    {/* {
      showCursor && <Pointer 
        cursorPosition={cursorPosition}
      />
    } */}

    <group
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {/* NavMeshes will be laid out here */}
    </group>
  </> 
}

export default Ground;
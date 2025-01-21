import { useEffect, useRef, useState } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";

import { usePlayers } from "@/web/components/room/components/context-providers/players";
import * as THREE from "three";
import { Pathfinding } from "three-pathfinding";
import { useGLTF } from "@react-three/drei";
import usePlayerStore from "@/web/store/players";

const MOUSE_MOVE_THRESHOLD_DIST = 0.01;
const PLAYER_MOVEMENT_PATH_CHANGE_THRESHOLD_DIST = 0.6;
const NAVMESH_MESH_NAME_PREFIX = "NavMesh_";

function Ground() {
  // const [_, _set] = useState<[number,number,number] | null>(null);
  // const [_showCursor, setShowCursor] = useState(false);

  const { handlePositionChange, getCurrentPlayer } = usePlayers();
  const currentPlayer = getCurrentPlayer();

  // This will be used to track mouse movement to determine if the click was
  // for moving the screen or the player
  const mouse = useRef<THREE.Vector2>(new THREE.Vector2());
  const mouseDown = useRef<THREE.Vector2>(new THREE.Vector2());

  const { camera } = useThree();
  
  // Navigation
  const { scene: navMeshScene } = useGLTF("/static/navmesh.glb");
  
  const [ navMeshGeometries, setNavMeshGeometries ] = useState<THREE.BufferGeometry[]>([]);
  const navMeshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const raycaster = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const pathfinder = useRef<Pathfinding>(new Pathfinding());
  const targetPosition = useRef<THREE.Vector3>(new THREE.Vector3());
  const path = useRef<THREE.Vector3[]>([]);
  const groupID = useRef<number | null>(null);
  const zoneID = useRef<string | null>(null);

  const findIntersectedNavMesh = (raycaster: THREE.Raycaster) => {
    for (let i = 0; i < navMeshRefs.current.length; i++) {
      const mesh = navMeshRefs.current[i];
      if (!mesh) continue;
      
      const intersects = raycaster.intersectObject(mesh);
      if (intersects.length) {
        return {
          intersect: intersects[0],
          zoneName: navMeshGeometries[i].name
        };
      }
    }
    return null;
  };
  
  useEffect(() => {
    const navmeshes: THREE.BufferGeometry[] = [];

    navMeshScene.traverse(o => {
      if ( o.type === "Mesh" && o.name.startsWith(NAVMESH_MESH_NAME_PREFIX) ) {
        const geom = (o as THREE.Mesh).geometry.clone();
        geom.name = o.name.split(NAVMESH_MESH_NAME_PREFIX)[1];
        
        navmeshes.push(geom);
      }
    });

    setNavMeshGeometries(navmeshes);
  }, [navMeshScene]);

  useEffect(() => {
    /** SETUP NAVIGATION ZONES */
    navMeshGeometries.forEach(mesh => {
      const zoneName = mesh.name;
      const zone = Pathfinding.createZone(mesh);
      pathfinder.current.setZoneData(zoneName, zone);
    })
  }, [navMeshGeometries]);

  /** HANDLES PLAYER MOVEMENT'S WAYPOINT THROUGH PATH CHANGE LOGIC */
  useFrame(() => {
    if ( !path.current.length || !currentPlayer ) return;

    const currentTargetPosition = path.current[0];
    const currentPosition = new THREE.Vector3(...usePlayerStore.getState().thisPlayerLiteralPosition);

    if ( currentPosition.distanceToSquared(currentTargetPosition) < PLAYER_MOVEMENT_PATH_CHANGE_THRESHOLD_DIST * PLAYER_MOVEMENT_PATH_CHANGE_THRESHOLD_DIST) {
      // Remove the first element ( i.e current target and change target )
      path.current.shift();
    }
    
    if ( !(new THREE.Vector3(...currentPlayer!.position).equals(currentTargetPosition)) ){
      handlePositionChange(currentTargetPosition.toArray());
    }
  });

  // const handlePointerMove = () => {
    // Only update cursor if we're interacting with the ground mesh
    // if (!showCursor) setShowCursor(true);
    
    // setCursorPosition([
    //   event.point.x,
    //   event.point.y,
    //   event.point.z,
    // ]);
  // };

  const handlePointerDown = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();

    // Clamping the values between [-1, 1]
    mouseDown.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseDown.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }
  
  const handlePointerUp = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    
    mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;

    if (
      Math.abs(mouseDown.current.x - mouse.current.x) > MOUSE_MOVE_THRESHOLD_DIST ||
      Math.abs(mouseDown.current.y - mouse.current.y) > MOUSE_MOVE_THRESHOLD_DIST
    )
      return; // If the mouse has moved ignore the player move
    
    raycaster.current.setFromCamera(mouse.current, camera);
    const intersectResult = findIntersectedNavMesh(raycaster.current);

    if ( !intersectResult ) return;

    const { intersect, zoneName } = intersectResult;

    // Update target position
    targetPosition.current.copy(intersect.point);
    
    // Ensure we're working with the correct zone
    zoneID.current = zoneName;
    
    // Get the current position vector
    const currentPos = new THREE.Vector3(...currentPlayer!.position);
    
    // Get the group ID for the current position
    groupID.current = pathfinder.current.getGroup(zoneName, currentPos);
    
    // Find path using the closest valid points
    const foundPath = pathfinder.current.findPath(
      currentPos,
      targetPosition.current,
      zoneName,
      groupID.current
    );

    if (foundPath && foundPath.length) {
      path.current = foundPath;
    }
  }

  return <>
    <mesh 
      // onPointerLeave={() => setShowCursor(false)}
      // onPointerMove={handlePointerMove}
      position={[0,-2,0]}
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
      {
        navMeshGeometries.map((geom, i) => (
          <group key={geom.uuid}>
            <mesh 
              ref={el => navMeshRefs.current[i] = el} 
              visible={false}
            >
              <primitive object={geom} attach="geometry" />
            </mesh>
          </group>
        ))
      }
    </group>
  </> 
}

export default Ground;
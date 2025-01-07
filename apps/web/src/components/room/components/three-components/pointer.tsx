import { useThree } from "@react-three/fiber";

interface PointerProps {
  cursorPosition: [number,number,number] | null;
}

function Pointer({
  cursorPosition,
}: PointerProps) {
  // Move in the parent instead of here in the future
  const { camera } = useThree();

  // If zoom greater than 140 then 0.25 otherwise change as a function
  function zoomToScale(x: number) {
    if (x <= 20) return 1;
    if (x >= 140 ) return 0.25;
    return (-(1/160)) * x + 1.125;
  }
  const calculatedScale = zoomToScale(camera.zoom);

  return (
    <group position={[cursorPosition?.[0] ?? 0, (cursorPosition?.[1] ?? 0.2 )+ 0.1, cursorPosition?.[2] ?? 0]} scale={[calculatedScale,calculatedScale,calculatedScale]}>
      {/* Pointer cone */}
      <mesh position={[0, 0.8, 0]} rotation={[0, 0, Math.PI]} scale={0.5}>
        <coneGeometry args={[0.5, 1.5, 4]} />
        <meshToonMaterial color="#ff4444" />
      </mesh>

      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0, 0]} scale={0.3}>
        <circleGeometry />
        <meshToonMaterial blending={4} color="#ff4444" />
      </mesh>
    </group>
  );
}

export default Pointer;
import { useSpring, animated } from '@react-spring/three'

export default function MoveTargetIndicator() {
  // Using a scale animation instead of directly animating the geometry
  const { opacity, scale } = useSpring({
    from: { opacity: 0.2, scale: 1.0 },
    to: { opacity: 1, scale: 1.2 },
    loop: {
      reverse: true,
    },
    config: {
      duration: 400,
    },
  })

  return (
    <group position={[0, 0.2, 0]}>
      <animated.mesh rotation={[-Math.PI / 2, 0, 0]} scale={scale}>
        <ringGeometry args={[0.1, 0.15]} />
        <animated.meshBasicMaterial color="#fff" transparent opacity={opacity} />
      </animated.mesh>
    </group>
  )
}
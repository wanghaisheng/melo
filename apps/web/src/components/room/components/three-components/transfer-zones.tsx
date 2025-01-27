import useSceneStore from "@/web/store/scene";

export default function TransferZones() {
  // What are transfer zones?
  // Transfer zones are the doors that connect rooms together.
  // They are invisible and are used to teleport players between rooms.
  
  const { transferZones } = useSceneStore();

  // TODO: Delete the transfer zone's original placeholder child

  return transferZones.map(placeholder => {
    console.log(placeholder.userData);
    return <mesh
      key={placeholder.uuid}
      position={placeholder.position}
      rotation={placeholder.rotation}
    >
      <boxGeometry args={[placeholder.scale.x, placeholder.scale.y, placeholder.scale.z]} />
      <meshBasicMaterial color="red" />
    </mesh>
  })
}
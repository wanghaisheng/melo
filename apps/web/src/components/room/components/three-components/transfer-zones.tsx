import useSceneStore from "@/web/store/scene";

export default function TransferZones() {
  // What are transfer zones?
  // Transfer zones are the doors that connect rooms together.
  // They are invisible and are used to teleport players between rooms.
  
  const { transferZones, playerCurrentTransferZone } = useSceneStore();
  
  // TODO: Delete the transfer zone's original placeholder child

  return transferZones.map(placeholder => {
    const isIntersecting = playerCurrentTransferZone?.userData.zone_name === placeholder.userData.zone_name;
    
    return <mesh
      key={placeholder.uuid}
      position={placeholder.position}
      rotation={placeholder.rotation}
    >
      <boxGeometry args={[placeholder.scale.x * 2.1, placeholder.scale.y * 2.1, placeholder.scale.z * 2.1]} />
      <meshBasicMaterial color={isIntersecting ? "red": "blue"} />
    </mesh>
  })
}
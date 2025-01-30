import { usePlayers } from "@/web/components/room/components/context-providers/players";
import { useAuthStore } from "@/web/store/auth";
import useGlobalStore from "@/web/store/global";
import useSceneStore from "@/web/store/scene";
import { WebSocketEvents } from "@melo/common/constants";
import type { ZoneTransferObjectProps, ZoneTransferRequest, ZoneTransferResponse } from "@melo/types";
import { Button } from "@melo/ui/ui/button";
import { Html } from "@react-three/drei";
import { useEffect } from "react";
import { type Object3D } from "three";
import { v4 as uuidv4 } from "uuid";

export default function TransferZones() {
  // What are transfer zones?
  // Transfer zones are the doors that connect rooms together.
  // They are invisible and are used to teleport players between rooms.
  
  const { socket } = useGlobalStore();
  const { auth } = useAuthStore();
  const { transferZones, playerCurrentTransferZone } = useSceneStore();
  const { handlePositionChange } = usePlayers();

  useEffect(() => {
    // socket?.on(WebSocketEvents.ZONE_TRANSFER_REQUEST, (data: any) => {
    //   // const transferRequest = data.request as ZoneTransferRequest;
      
    // });
    if ( socket?.isRegistered(WebSocketEvents.ZONE_TRANSFER_RESPONSE) ) return;
    
    socket?.on(WebSocketEvents.ZONE_TRANSFER_RESPONSE, (data: any) => {
      const response = data.response as ZoneTransferResponse;
      const playerCurrentTransferZone = useSceneStore.getState().playerCurrentTransferZone;
      const zoneProps = playerCurrentTransferZone?.userData as ZoneTransferObjectProps | null;

      if ( !playerCurrentTransferZone || !zoneProps || zoneProps.zone_identifier !== response.transferRequest.zone.from) {
        return console.error("ERROR: Force zone teleport hasn't been implemented yet");
      }

      handlePositionChange([zoneProps.target_pos_x, zoneProps.target_pos_z, -zoneProps.target_pos_y]);
    });
  }, []);
  
  const handleKnock = (isIntersecting: boolean, transferZone: Object3D) => {
    if (!isIntersecting || !socket || !(auth?.status === "auth") || !auth.user) return;

    const transferZoneProps = transferZone.userData as ZoneTransferObjectProps;

    // Emit a knock request to the server
    socket?.emit(WebSocketEvents.ZONE_TRANSFER_REQUEST, {
      request: {
        requestFrom:auth.user.uid,
        requestId: uuidv4(),
        timestamp: Date.now(),
        zone: {
          from: transferZone.userData.zone_identifier,
          to: transferZoneProps.target_zone_identifier,
        },
        goToPublic: transferZoneProps.is_to_public,
      } satisfies ZoneTransferRequest
    });
  }
  
  // TODO: Delete the transfer zone's original placeholder child
  return transferZones.map(placeholder => {
    const isIntersecting = playerCurrentTransferZone?.userData.zone_identifier === placeholder.userData.zone_identifier;

    return <mesh
      key={placeholder.userData.zone_identifier}
      position={placeholder.position}
      rotation={placeholder.rotation}
    >
      <Html>
        {
          isIntersecting && (
            <span className="absolute -top-32 w-20 h-12 rounded-lg -translate-x-1/2">
              <Button onClick={() => handleKnock(isIntersecting, placeholder)} variant="secondary">
                Knock
              </Button>
            </span>
          )
        }
      </Html>
      <boxGeometry args={[placeholder.scale.x * 2.1, placeholder.scale.y * 2.1, placeholder.scale.z * 2.1]} />
      <meshBasicMaterial color={isIntersecting ? "red": "blue"} />
    </mesh>
  })
}
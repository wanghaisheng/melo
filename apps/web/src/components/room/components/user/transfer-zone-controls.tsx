import { useAuthStore } from "@/web/store/auth";
import useGlobalStore from "@/web/store/global";
import usePlayerStore from "@/web/store/players";
import useSceneStore from "@/web/store/scene";
import { WebSocketEvents } from "@melo/common/constants";
import type { ZoneTransferObjectProps, ZoneTransferRequest } from "@melo/types";
import { Button } from "@melo/ui/ui/button";
import { DoorClosed, DoorOpen } from "lucide-react";

import { v4 as uuidv4 } from "uuid";

import { motion, AnimatePresence } from "motion/react";
import { useMemo } from "react";
import type { Object3D } from "three";

export default function TransferZoneControls() {
  // These are buttons that show up when a user is in the transfer zone
  // User has the option to either click the button beside the user character or this

  const { playerCurrentTransferZone } = useSceneStore();
  const { players } = usePlayerStore();
  const { auth } = useAuthStore();
  const { socket } = useGlobalStore();
  
  const [buttonText, playerInTargetZone] = useMemo(() => {
    if (!playerCurrentTransferZone) return ["", null];
    
    const zoneData = playerCurrentTransferZone.userData as ZoneTransferObjectProps;
    const playerInTargetZone = players.find(player => player.zone === zoneData.target_zone_name);

    return [zoneData.is_to_public ? "Exit room" : !playerInTargetZone ? "Enter empty room" : "Knock on the door", playerInTargetZone]
  }, [playerCurrentTransferZone, players]); 
  
  const handleKnock = (transferZone: Object3D) => {
    if (!socket || !(auth?.status === "auth") || !auth.user) return;

    const transferZoneProps = transferZone.userData as ZoneTransferObjectProps;

    // Emit a knock request to the server
    socket?.emit(WebSocketEvents.ZONE_TRANSFER_REQUEST, {
      request: {
        requestFrom:auth.user.uid,
        requestId: uuidv4(),
        timestamp: Date.now(),
        zoneIdentifier: {
          from: transferZone.userData.zone_identifier,
          to: transferZoneProps.target_zone_identifier,
        },
        zone: {
          from: transferZoneProps.zone_name,
          to: transferZoneProps.target_zone_name,
        },
        goToPublic: transferZoneProps.is_to_public,
      } satisfies ZoneTransferRequest
    });
  }
  
  return (
    <div 
      className="absolute flex flex-col 
      bottom-20 z-[9] 
      left-1/2 -translate-x-1/2">
        <AnimatePresence>
          {
            !!playerCurrentTransferZone && (
              <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              >
                <Button 
                onClick={() => {
                  if ( !playerCurrentTransferZone ) return;

                  handleKnock(playerCurrentTransferZone);
                }}
                className="flex items-center gap-3 h-6 rounded-md p-4 text-sm text-white bg-blue-500 hover:bg-blue-600">
                  {
                    playerInTargetZone ? <DoorClosed size={17} /> : <DoorOpen size={17} />
                  }
                  { buttonText }
                </Button>
              </motion.div>
            )
          }
        </AnimatePresence>
    </div>
  );
}
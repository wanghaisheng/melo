import Image from "next/image";

import { useAuthStore } from "@/web/store/auth";
import useGlobalStore from "@/web/store/global";
import usePlayerStore from "@/web/store/players";
import useSceneStore from "@/web/store/scene";
import { WebSocketEvents } from "@melo/common/constants";
import type { ZoneTransferObjectProps, ZoneTransferRequest } from "@melo/types";
import { Button } from "@melo/ui/ui/button";
import { ChevronDown, DoorClosed, DoorOpen } from "lucide-react";

import { v4 as uuidv4 } from "uuid";

import { motion, AnimatePresence } from "motion/react";
import { useMemo } from "react";
import type { Object3D } from "three";
import { ScrollArea } from "@melo/ui/ui/scroll-area";

export default function TransferZoneControls() {
  // These are buttons that show up when a user is in the transfer zone
  // User has the option to either click the button beside the user character or this

  const { playerCurrentTransferZone } = useSceneStore();
  const { players, transferZoneRequests } = usePlayerStore();
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

  const transferZoneRequestsOfCurrentTransferZone = useMemo(() => {
    if (!playerCurrentTransferZone) return [];

    const zoneData = playerCurrentTransferZone.userData as ZoneTransferObjectProps;
    const transferZoneRequestsOfCurrentTransferZone = transferZoneRequests.filter(transferZoneRequest => {
      return transferZoneRequest.zoneIdentifier.to === zoneData.zone_identifier;
    });

    return transferZoneRequestsOfCurrentTransferZone;
  }, [transferZoneRequests, playerCurrentTransferZone]);

  return (
    <>
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
      <div className={`
        absolute 
        left-1/2 -translate-x-1/2 
        flex justify-center
        h-40 w-96 
        z-[9]
        group
        `}>
          <div className={`
          ${transferZoneRequestsOfCurrentTransferZone.length > 0 ? "translate-y-0" : "-translate-y-12"}
          
          absolute
          transition-all
          w-48 py-[2px]

          bg-blue-500 backdrop-blur-sm rounded-b-lg overflow-hidden
          flex gap-2 justify-center items-center
  
          text-white text-xs
            `}>
            View knock requests
            <ChevronDown size={18}/>
          </div>
          <div className={`
              absolute transition-all
              ${transferZoneRequestsOfCurrentTransferZone.length > 0 ? "group-hover:translate-y-0 " : ""}
              -translate-y-40
              h-full w-full bg-gray-800/30 backdrop-blur-sm rounded-b-lg
              p-2

              flex flex-col overflow-auto
            `}>
              <div className="flex items-center text-white text-sm font-bold gap-1">
                <DoorOpen size={18} className="" />
                Knocks
              </div>
              <ScrollArea>
                {
                  transferZoneRequestsOfCurrentTransferZone.map(transferZoneRequest => {
                    const requestingPlayer = players.find(player => player.auth_uid === transferZoneRequest.requestFrom);
                    
                    if ( !requestingPlayer ) return;
                    
                    return (
                      <div key={transferZoneRequest.requestId} className="flex gap-2 justify-between items-center my-3 bg-white rounded-lg p-1">
                        <div className={`
                          relative
                          min-w-7 h-7
                          bg-black rounded-lg
                          flex justify-center items-center
                          text-white
              
                          overflow-hidden
                          `}>
                          {
                            requestingPlayer.photoURL ? (
                              <Image 
                                src={requestingPlayer.photoURL}
                                alt="Profile Picture"
                                width={100}
                                height={100}
                                className="w-full h-full"
                              />
                            ) : (
                              (requestingPlayer.displayName || "John Doe")?.slice(0,2).toUpperCase()
                            )
                          }
                          
                        </div>
                        <span className="flex-1 text-xs">
                          <span className="font-bold text-zinc-600">
                            { requestingPlayer.displayName || requestingPlayer.username }
                          </span>
                        </span>
                        <Button className="text-[9px] bg-rose-500 hover:bg-rose-600 py-0 px-2 h-6">Deny</Button>
                        <Button className="text-[9px] bg-blue-500 hover:bg-blue-600 py-0 px-2 h-6">Accept</Button>
                      </div>
                    );
                  })
                }
              </ScrollArea>
          </div>
      </div> 
    </>
  );
}
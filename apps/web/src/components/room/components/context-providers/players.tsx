import Loader from "@/web/components/room/components/loader";
import useGlobalStore from "@/web/store/global";
import usePlayerStore from "@/web/store/players";
import useSceneStore from "@/web/store/scene";
import { WebSocketEvents } from "@melo/common/constants";
import type { PlayerData, ZoneTransferRequest } from "@melo/types";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast as sonnerToast } from "sonner";
import * as THREE from "three";
import Image from "next/image";

const playersContext = createContext<PlayersContext | null>(null);

interface PlayersProviderProps {
  children: React.ReactNode;
}

interface PlayersContext {
  handleUpdatePlayerData(data: PlayerData): void;
  getCurrentPlayer(): PlayerData | void;
  handlePositionChange(position: [number, number, number]): void;
  handleDisplayNameChange(displayName: string): void;
  handleZoneChange(zone: string): void;
  handleZoneAndPositionChange(zone: string, position: [number, number, number]): void;
}

let prevChangedPosition: [number,number,number] | null = null;

export default function PlayersProvider({
  children,
}: PlayersProviderProps) {
  const {
    setPlayers,
    players,
    addTransferZoneRequest,
  } = usePlayerStore();
  const { transferZones } = useSceneStore();
  const { socket } = useGlobalStore();
  const [ loading, setLoading ] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    if(!socket) return console.error("Socket is not initialized");
    
    if (socket.isRegistered(WebSocketEvents.GLOBAL_PLAYER_DATA_UPDATE)) return;
    
    socket.on(WebSocketEvents.GLOBAL_PLAYER_DATA_UPDATE, ({ data }) => {
      // Data comes in as Object [string]: PlayerData, we need to convert to PlayerData[]
      const players = Object.values(data as Record<string, PlayerData>);
      setPlayers(players);
    });
    // Artificially create a very small delay to show loading realistically
    new Promise((r,_) => setTimeout(r, 300)).then(() => setLoading(false));
  }, [setPlayers, socket]);

  useEffect(() => {
    if(!socket) return console.error("Socket is not initialized");
    
    if (socket.isRegistered(WebSocketEvents.ZONE_TRANSFER_REQUEST)) return;

    socket.on(WebSocketEvents.ZONE_TRANSFER_REQUEST, ({ request}: { request: ZoneTransferRequest}) => {

      const players = usePlayerStore.getState().players;
      
      const requestingPlayer = players.find(player => player.connectionId, request.requestFrom );
      if ( !requestingPlayer ) return console.error("Could not find requesting player in knock request" );
      
      sonnerToast.message(
        <div className="flex items-center h-full w-full gap-3">
          <div className="w-8 h-8 rounded-2xl overflow-hidden flex items-center justify-center">
            {
              requestingPlayer.photoURL !== null || requestingPlayer.photoURL!.trim() !== "" ? (
                <Image src={requestingPlayer.photoURL! } alt="Profile picture of requesting player" width={50} height={50}/>
              ) : (
                <div className="h-full w-full bg-zinc-800 flex items-center justify-center">
                  {
                    requestingPlayer.displayName.slice(0,2).toUpperCase()
                  }
                </div>
              )
            }
          </div>
          {requestingPlayer.displayName} is knocking.
        </div>
      )
      addTransferZoneRequest(request);

    });
  }, [socket]);
  
  const handleUpdatePlayerData = (data: PlayerData) => {
    if(!socket) return console.error("Socket is not initialized");

    socket.emit(WebSocketEvents.PLAYER_DATA_UPDATE, data );
  }
  
  const getCurrentPlayer = () => {
    if(!socket) return console.error("Socket is not initialized");
    
    const player = players.find(player => player.connectionId === socket.id);
    
    if(!player) return console.error("Current player not found");

    return player;
  }
  
  const handleZoneChange = (zone: string) => {
    if(!socket) return console.error("Socket is not initialized");

    const player = players.find(player => player.connectionId === socket.id);
    if(!player) return console.error("Current player not found");

    handleUpdatePlayerData({
      ...player,
      zone,
    });
  }
  
  // PRIVATE
  const handlePositionChangeAndOther = (position: [number, number, number], data: Partial<PlayerData>) => {
    /** USEFRAME AND STATE UPDATES ARE WONKY SO A SAFEGUARD FOR LOWERING THE AMOUNT OF POSITION CHANGE */
    if ( prevChangedPosition && prevChangedPosition.toString() === position.toString() )
      return;

    prevChangedPosition = position;
    
    if(!socket) return console.error("Socket is not initialized");

    // Get the corresponding player data with connectionId = socket.id
    const player = players.find(player => player.connectionId === socket.id);    
    if(!player) return;

    // Ping position change to zone transfer
    // WHY here? : Calculating intersection here is very cheap as compared
    // to doing it in the transfer zone component or the frame loop.\
    let intersectedZone = null;
    for ( const zone of transferZones ) {
      const boundingBox = new THREE.Box3().setFromObject(zone);

      if ( boundingBox.containsPoint( new THREE.Vector3(...position) ) ) {
        intersectedZone = zone;
        break;
      }
    }

    useSceneStore.setState({
      playerCurrentTransferZone: intersectedZone,
    });
    
    handleUpdatePlayerData({
      ...player,
      ...data,
      position,
    });
  }
  
  const handlePositionChange = (position: [number, number, number]) => {
    handlePositionChangeAndOther(position, {});
  }

  const handleZoneAndPositionChange = (zone: string, position: [number, number, number]) => {
    handlePositionChangeAndOther(position, { zone });
  }
  
  const handleDisplayNameChange = (displayName: string) => {
    const player = getCurrentPlayer();
    if(!player) return;
    
    handleUpdatePlayerData({
      ...player,
      displayName,
    });
  }

  if ( loading ) return <Loader title="Players Loading..." subtitle="The server is managing players connection." progress={40}/>
  
  return <playersContext.Provider value={{
    handleUpdatePlayerData,
    getCurrentPlayer,
    handlePositionChange,
    handleDisplayNameChange,
    handleZoneChange,
    handleZoneAndPositionChange,
  }}>
    { children }
  </playersContext.Provider>
}

export const usePlayers = () => {
  return useContext(playersContext) as PlayersContext;
}
import Loader from "@/web/app/room/_components/loader";
import useGlobalStore from "@/web/store/global";
import usePlayerStore from "@/web/store/players";
import { PlayerData } from "@melo/types";
import React, { createContext, useContext, useEffect, useState } from "react";

const playersContext = createContext<PlayersContext | null>(null);

interface PlayersProviderProps {
  children: React.ReactNode;
}

interface PlayersContext {
  handleUpdatePlayerData(data: PlayerData): void;
  getCurrentPlayer(): PlayerData | void;
  handlePositionChange(position: [number, number, number]): void;
  handleDisplayNameChange(displayName: string): void;
}

export default function PlayersProvider({
  children,
}: PlayersProviderProps) {
  const {
    players,
    setPlayers,
  } = usePlayerStore();
  const { socket } = useGlobalStore();

  const [ loading, setLoading ] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    if(!socket) return console.error("Socket is not initialized");
    
    if (socket.isRegistered("global-player-data-update")) return;
    
    socket.on("global-player-data-update", ({ data }) => {
      // Data comes in as Object [string]: PlayerData, we need to convert to PlayerData[]
      const players = Object.values(data as Record<string, PlayerData>);
      setPlayers(players);
    });


    // Artificially create a very small delay to show loading realistically
    new Promise((r,_) => setTimeout(r, 300)).then(() => setLoading(false));
  }, [socket]);

  const handleUpdatePlayerData = (data: PlayerData) => {
    if(!socket) return console.error("Socket is not initialized");

    socket.emit("player-data-update", data );
  }
  
  const getCurrentPlayer = () => {
    if(!socket) return console.error("Socket is not initialized");
    
    const player = players.find(player => player.connectionId === socket.id);
    
    if(!player) return console.error("Current player not found");

    return player;
  }
  
  const handlePositionChange = (position: [number, number, number]) => {
    if(!socket) return console.error("Socket is not initialized");
    
    // Get the corresponding player data with connectionId = socket.id
    const player = players.find(player => player.connectionId === socket.id);    
    if(!player) return;
    
    handleUpdatePlayerData({
      ...player,
      position,
    });
  }

  const handleDisplayNameChange = (displayName: string) => {
    const player = getCurrentPlayer();
    if(!player) return;
    
    handleUpdatePlayerData({
      ...player,
      displayName,
    });
  }

  // if ( loading ) return <div>Players Loading...</div>
  if ( loading ) return <Loader title="Players Loading..." subtitle="The server is managing players connection." progress={40}/>
  
  return <playersContext.Provider value={{
    handleUpdatePlayerData,
    getCurrentPlayer,
    handlePositionChange,
    handleDisplayNameChange,
  }}>
    { children }
  </playersContext.Provider>
}

export const usePlayers = () => {
  return useContext(playersContext) as PlayersContext;
}
import useGlobalStore from "@/web/store/global";
import usePlayerStore from "@/web/store/players";
import { useEffect } from "react";

// This component must be inside the SocketConnection component
export default function ConnectSocket({
  children
}: {
  children: React.ReactNode;
}) {

  const { socket } = useGlobalStore();
  const { players } = usePlayerStore();

  useEffect(() => {
    if(!socket) return console.error("Socket is not initialized");
    
    socket.connect();
  }, [socket]);

  console.log(players.length);
  if (!socket || players.length < 1) return <div>Socket Loading....</div>
  
  return children;
}


import Loader from "@/web/app/app/components/loader";
import useGlobalStore from "@/web/store/global";
import usePlayerStore from "@/web/store/players";
import { useEffect } from "react";

// This component must be inside the SocketConnection component
export default function ConnectSocket({
  children
}: {
  children: React.ReactNode;
}) {

  const { socket, socketConnectCallbacks } = useGlobalStore();
  const { players } = usePlayerStore();

  useEffect(() => {
    if(!socket) return console.error("Socket is not initialized");
    
    socket.connect();

    socketConnectCallbacks.forEach(cb => {
      cb(socket);
    });
  }, [socket]);

  // if (!socket || players.length < 1) return <div>Socket Loading....</div>
  if (!socket || players.length < 1) return <Loader title="Socket Loading..." subtitle="The server is configuring socket connections." progress={60} />
  
  return children;
}


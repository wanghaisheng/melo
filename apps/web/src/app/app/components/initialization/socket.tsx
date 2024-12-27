import useGlobalStore from "@/web/store/global";
import Socket from "@/web/core/socket";
import React, { useEffect } from "react";

interface SocketConnectionProps {
  children: React.ReactNode;
}

export default function SocketConnection({ children } : SocketConnectionProps) {
  const { socket, setSocket } = useGlobalStore();

  useEffect(() => {
    setSocket(new Socket({
      host: "http://localhost:1999/",
      room: "my-test-room",
    }));
  }, []);

  useEffect(() => {

  }, [socket]);
  
  return children;
}
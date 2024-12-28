import useGlobalStore from "@/web/store/global";
import Socket from "@/web/core/socket";
import React, { useEffect } from "react";

interface SocketConnectionProps {
  children: React.ReactNode;
  room: string;
}

export default function SocketConnection({ children, room } : SocketConnectionProps) {
  const { setSocket } = useGlobalStore();

  useEffect(() => {
    setSocket(new Socket({
      host: "http://localhost:1999/",
      room,
    }));
  }, []);

  return children;
}
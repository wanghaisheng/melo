import useGlobalStore from "@/web/store/global";
import Socket from "@/web/core/socket";
import React, { useEffect } from "react";

import { PARTYKIT_HOST } from "@/web/env";
import { useAuthStore } from "@/web/store/auth";
import { WebSocketEvents } from "@melo/common/constants";

interface SocketConnectionProps {
  children: React.ReactNode;
  room: string;
}

export default function SocketConnection({ children, room } : SocketConnectionProps) {
  const { setSocket, addSocketConnectCallbacks } = useGlobalStore();
  const { auth } = useAuthStore();

  useEffect(() => {
    if ( !auth || auth.status !== "auth" ) return;
    
    setSocket(new Socket({
      host: PARTYKIT_HOST,
      room,
    }));
    
    addSocketConnectCallbacks(async socket => {
      // "Connect" with the socket
      socket.emit(WebSocketEvents.USER_CONNECT, {
        auth_uid: auth.user!.uid,
      });
    });
  }, []);

  return children;
}
import MediaInitialization from "@/web/components/room/components/initialization/media-initialization";
import Loader from "@/web/components/room/components/loader";
import useLogs from "@/web/hooks/useLogs";
import useGlobalStore from "@/web/store/global";
import { useStreamsStore } from "@/web/store/streams";
import { WebSocketEvents } from "@melo/common/constants";
import { createContext, type RefObject, useContext, useEffect, useRef, useState } from "react";

const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' }
  ]
};

// CONTEXT
interface StreamsContext {
  peersRef: RefObject<Map<string, RTCPeerConnection>>;
}

const streamsContext = createContext<StreamsContext | null>(null);

// Provider
interface StreamsProviderProps {
  children: React.ReactNode;
}

export default function StreamsProvider({
  children,
}: StreamsProviderProps) {
  const { socket, addSocketConnectCallbacks } = useGlobalStore();
  const { addNewLog } = useLogs();
  
  const peersRef = useRef(new Map<string, RTCPeerConnection>());

  const [loading, setLoading] = useState(true);

  const createPeerConnection = (userId: string, stream: MediaStream): RTCPeerConnection => {
    const pc = new RTCPeerConnection(configuration);
    peersRef.current.set(userId, pc);

    pc.onicecandidate = e => {
      if (e.candidate && socket) {
        socket.emit(WebSocketEvents.P2P_ICE_CANDIDATE, {
        candidate: e.candidate,
          to: userId,
        });
      }
    };

    pc.ontrack = event => {
      const stream = event.streams[0];

      useStreamsStore.setState(state => ({
        peersStream: new Map(state.peersStream.set(userId, stream))
      }));
    };

    stream?.getTracks().forEach(track => pc.addTrack(track, stream));
    return pc;
  };

  const initiatePeerConnection = async (userId: string, stream: MediaStream) => {
    const pc = createPeerConnection(userId, stream);
    try {
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await pc.setLocalDescription(offer);
      socket?.emit(WebSocketEvents.P2P_OFFER, { offer, to: userId });
    } catch(e) {
      console.error("Error creating offer:", e);
    }
  };
  
  const init = async (stream: MediaStream) => {
    if (!socket) return;
    
    try {
      useStreamsStore.setState({ localStream: stream, loading: false });

      socket.on(WebSocketEvents.EXISTING_USERS, ({ users }: { users: string[] }) => {
        users.forEach(id => initiatePeerConnection(id, stream));
      });

      socket.on(WebSocketEvents.USER_JOINED, ({ id }) => {
        if (!peersRef.current.has(id)) {
          createPeerConnection(id, stream);
        }
        addNewLog?.({
          data: `User ${id.slice(0,6)} has joined`,
          level: "success",
        });
      });

      socket.on(WebSocketEvents.P2P_OFFER, async ({ offer, from }) => {
        let pc = peersRef.current.get(from);
        if (!pc) {
          pc = createPeerConnection(from, stream);
        }
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit(WebSocketEvents.P2P_ANSWER, { answer, to: from });
      });

      socket.on(WebSocketEvents.P2P_ANSWER, async ({ answer, from }) => {
        const pc = peersRef.current.get(from);
        if (pc) {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        }
      });

      socket.on(WebSocketEvents.P2P_ICE_CANDIDATE, async ({ candidate, from }) => {
        const pc = peersRef.current.get(from);
        if (pc) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
      });

      socket.on(WebSocketEvents.USER_LEFT, ({ id }) => {
        if (peersRef.current.has(id)) {
          peersRef.current.get(id)?.close();
          peersRef.current.delete(id);
          useStreamsStore.setState(state => {
            const newPeers = new Map(state.peersStream);
            newPeers.delete(id);
            return { peersStream: newPeers };
          });
        }
        addNewLog?.({
          data: `User ${id.slice(0,6)} has left`,
          level: "danger",
        });
      });

    } catch(e) {
      console.error("Error initializing:", e);
      useStreamsStore.setState({ error: e as Error, loading: false });
    }
  };
  
  
  if ( loading ) return (
    <div className="h-screen w-screen flex">
      <Loader title="Media Devices Configurations" subtitle="The server will be managing peer-to-peer connections" className="flex-[3] px-0 mx-0 hidden md:flex"/>
      <MediaInitialization 
        onInitialize={(stream, isVideoEnabled, isAudioEnabled, videoDeviceId, audioDeviceId) => {
          addSocketConnectCallbacks(async socket => {
            socket.emit(WebSocketEvents.SET_STREAM_PROPERTIES, {
              video: isVideoEnabled,
              audio: isAudioEnabled,
            });
          });

          useStreamsStore.setState({
            isVideoEnabled,
            isAudioEnabled,
            videoDeviceId,
            audioDeviceId,
          });

          init(stream).then(() => setLoading(false));
        }}
      />
    </div>
  )
    
  return <streamsContext.Provider value={{
    peersRef,
  }}>
    { children }
  </streamsContext.Provider>
}

export function useStreams() {
  return useContext(streamsContext) as StreamsContext;
}
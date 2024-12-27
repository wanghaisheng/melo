import Socket from "@/web/core/socket";
import { useStreamsStore } from "@/web/store/streams";
import { useEffect, useRef } from "react";

const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' }
  ]
};

let __isCalled = false;

const useStreams = (socket: Socket | null, addNewLog?: (log: { data: string, level: string }) => void) => {
  const store = useStreamsStore();
  const peersRef = useRef(new Map<string, RTCPeerConnection>());

  const createPeerConnection = (userId: string, stream: MediaStream): RTCPeerConnection => {
    const pc = new RTCPeerConnection(configuration);
    peersRef.current.set(userId, pc);

    pc.onicecandidate = e => {
      if (e.candidate && socket) {
        socket.emit('ice-candidate', {
          candidate: e.candidate,
          to: userId,
        });
      }
    };

    pc.ontrack = event => {
      useStreamsStore.setState(state => ({
        peersStream: new Map(state.peersStream.set(userId, event.streams[0]))
      }));
    };

    stream?.getTracks().forEach(track => pc.addTrack(track, stream));
    return pc;
  };

  const initiatePeerConnection = async (userId: string, stream: MediaStream) => {
    const pc = createPeerConnection(userId, stream);
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket?.emit('offer', { offer, to: userId });
    } catch(e) {
      console.error("Error creating offer:", e);
    }
  };

  useEffect(() => {
    if (__isCalled) {
      console.error("useStreams should only be called once");
      return;
    }
    __isCalled = true;
    
    if (!socket) return;

    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        
        useStreamsStore.setState({ localStream: stream, loading: false });

        socket.on("existing-users", ({ users }: { users: string[] }) => {
          users.forEach(id => initiatePeerConnection(id, stream));
        });

        socket.on("user-joined", ({ id }) => {
          if (!peersRef.current.has(id)) {
            createPeerConnection(id, stream);
          }
          addNewLog?.({
            data: `User ${id.slice(0,6)} has joined`,
            level: "success",
          });
        });

        socket.on("offer", async ({ offer, from }) => {
          let pc = peersRef.current.get(from);
          if (!pc) {
            pc = createPeerConnection(from, stream);
          }
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("answer", { answer, to: from });
        });

        socket.on("answer", async ({ answer, from }) => {
          const pc = peersRef.current.get(from);
          if (pc) {
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
          }
        });

        socket.on("ice-candidate", async ({ candidate, from }) => {
          const pc = peersRef.current.get(from);
          if (pc) {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          }
        });

        socket.on("user-left", ({ id }) => {
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

    init();

    return () => {
      store.cleanup();
    };
  }, [socket]);

  return {
    ...store,
  };
};

export default useStreams;
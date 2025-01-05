import Socket from '@/web/core/socket';
import { WebSocketEvents } from '@melo/common/constants';
import { create } from 'zustand';

import useGlobalStore from '@/web/store/global';

interface StreamsState {
  peersStream: Map<string, MediaStream | null>;
  loading: boolean;
  error: Error | null;
  setError: (error: Error | null) => void;
  cleanup: () => void;
  
  // Local Stream
  localStream: MediaStream | null;
  setLocalStream: (stream: MediaStream | null) => void;
  isVideoEnabled: boolean;
  toggleLocalVideo: (peersMap: Map<string, RTCPeerConnection>, socket: Socket) => Promise<void>;
  setLocalVideo: (
    isVideoEnabled: boolean,
    peersMap: Map<string, RTCPeerConnection>, 
    socket: Socket,
    skipEnabledStateUpdate?: boolean, // Used at first to toggle and untoggle streams
  ) => Promise<void>;
}

export const useStreamsStore = create<StreamsState>((set, get) => ({
  localStream: null,
  setLocalStream: stream => set({ localStream: stream }),
  peersStream: new Map(),
  loading: true,
  error: null,
  setError: (error) => set({ error }),
  cleanup: () => {
    const { localStream } = get();
    localStream?.getTracks().forEach(track => track.stop());
    set({ localStream: null, peersStream: new Map() });
  },

  isVideoEnabled: false,
  setLocalVideo: async (enableVideo, peers, socket) => {
    const { localStream } = get();
    
    if ( localStream ) {
      if ( enableVideo ) {
        const globalStore = useGlobalStore.getState();
        
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: globalStore.videoDeviceId!,
          }
        });
        const track = newStream.getVideoTracks()[0];

        if (!localStream) throw new Error("Missing local stream");
        
        localStream.addTrack(track);

        peers.forEach(async (pc, peerId) => {
          pc.addTrack(track, newStream);

          try {
            // We are renegotiating with the peer connection due to media stream change
            const offer = await pc.createOffer();
            await pc.setLocalDescription(new RTCSessionDescription(offer));

            socket!.emit(WebSocketEvents.P2P_OFFER, {
              offer,
              to: peerId,
            });

          } catch (e) {
            console.log("Error while enabling camera: ", e);
          }
        });

      } else {

        peers.forEach((pc, peerId) => {
          const senders = pc.getSenders();
          const videoSender = senders.find(s => s.track?.kind === "video");
          if (videoSender) {
            pc.removeTrack(videoSender);
          }
        });
        
        localStream?.removeTrack(localStream.getVideoTracks()[0]);
        
      }
      
      socket.emit(WebSocketEvents.SET_STREAM_PROPERTIES, {
        video: enableVideo,
      });

      set({
        isVideoEnabled: enableVideo,
      });
    } else {
      console.log('No local stream available');
    }
  },
  toggleLocalVideo: async (peers, socket) => {
    const { isVideoEnabled} = get();
    
    if (isVideoEnabled)
      // If enabled, disable it
      get().setLocalVideo(false, peers, socket);
    else
      get().setLocalVideo(true, peers, socket);
        
  }
}));
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
  isAudioEnabled: boolean;
  toggleLocalVideo: (peersMap: Map<string, RTCPeerConnection>, socket: Socket) => Promise<void>;
  toggleLocalAudio: (peersMap: Map<string, RTCPeerConnection>, socket: Socket) => Promise<void>;
  setLocalTrack: (
    type: 'audio' | 'video',
    enabled: boolean,
    peersMap: Map<string, RTCPeerConnection>, 
    socket: Socket,
    skipEnabledStateUpdate?: boolean,
  ) => Promise<void>;

  // Store the streaming devices ID to remember when toggling in-call
  videoDeviceId: string | null;
  audioDeviceId: string | null;
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
  isAudioEnabled: true, // Usually starts enabled
  setLocalTrack: async (type, enabled, peers, socket) => {
    const { localStream } = get();
    
    if (localStream) {
      if (enabled) {
        const constraints = {
          [type]: {
            deviceId: type === "audio" ? get().audioDeviceId! : get().videoDeviceId!,
          }
        };
        
        const newStream = await navigator.mediaDevices.getUserMedia(constraints);
        const track = newStream.getTracks()[0];

        if (!localStream) throw new Error("Missing local stream");
        
        localStream.addTrack(track);

        peers.forEach(async (pc, peerId) => {
          pc.addTrack(track, newStream);

          try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(new RTCSessionDescription(offer));

            socket.emit(WebSocketEvents.P2P_OFFER, {
              offer,
              to: peerId,
            });

          } catch (e) {
            console.log(`Error while enabling ${type}: `, e);
          }
        });

      } else {
        peers.forEach((pc) => {
          const senders = pc.getSenders();
          const sender = senders.find(s => s.track?.kind === type);
          if (sender) {
            pc.removeTrack(sender);
          }
        });
        
        const track = localStream.getTracks().find(t => t.kind === type);
        if (track) {
          localStream.removeTrack(track);
        }
      }
      
      socket.emit(WebSocketEvents.SET_STREAM_PROPERTIES, {
        [type]: enabled,
      });

      set({
        [`is${type.charAt(0).toUpperCase() + type.slice(1)}Enabled`]: enabled,
      });
    } else {
      console.log('No local stream available');
    }
  },
  
  toggleLocalVideo: async (peers, socket) => {
    const { isVideoEnabled } = get();
    get().setLocalTrack('video', !isVideoEnabled, peers, socket);
  },

  toggleLocalAudio: async (peers, socket) => {
    const { isAudioEnabled } = get();
    get().setLocalTrack('audio', !isAudioEnabled, peers, socket);
  },

  videoDeviceId: null,
  audioDeviceId: null,
}));
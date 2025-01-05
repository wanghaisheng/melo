import VideoStream from "@/web/app/app/components/video-stream";
import { Button } from "@/web/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/web/components/ui/select";
import { Mic, MicOff, SquarePlus, Video, VideoOff } from "lucide-react";
import { useEffect, useState } from "react";

interface MediaInitializationProps {
  onInitialize: (
    stream: MediaStream,
    isVideoEnabled: boolean,
    isAudioEnabled: boolean,
  ) => void;
}

interface MediaSelectProps {
  mediaEnabled: boolean;
  currentDeviceId: string | null;
  inputDevices: MediaDeviceInfo[];
  mediaToggleHandler: (value: boolean) => void;

  kind: "video" | "audio";
}

const MediaSelect = ({
  mediaEnabled,
  mediaToggleHandler,
  currentDeviceId,
  inputDevices,
  kind,
}: MediaSelectProps) => {
  return <div className="flex flex-col gap-1 mb-2 mt-2">
    <h3 className="text-lg font-bold capitalize">Configure {kind}</h3>
    <div className="flex gap-3 items-center">
      <Button onClick={() => mediaToggleHandler(!mediaEnabled)} variant="outline">
        {
          mediaEnabled ? (
            kind === "audio" ? <Mic /> : <Video />
          ) : (
            kind === "audio" ? <MicOff /> : <VideoOff />
          )
        }
      </Button>

      <Select value={currentDeviceId ?? ""} disabled={currentDeviceId === null}>
        <SelectTrigger className="w-[20rem]">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          {
            inputDevices.map(device => (
              <SelectItem key={device.deviceId} value={device.deviceId} className="capitalize">{device.label}</SelectItem>
            ))
          }
        </SelectContent>
      </Select>
    </div>
  </div> 
}

export default function MediaInitialization({
  onInitialize,
}: MediaInitializationProps) {
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [isVideoEnabled, setVideoEnabled] = useState(true);
  const [isAudioEnabled, setAudioEnabled] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const configureStreamMedia = async () => {
    const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true, })
    setStream(s);
  }

  const getAllMediaInputs = async () => {
    const inputs = await navigator.mediaDevices.enumerateDevices();
    const inputGroups = Object.groupBy(inputs, i => i.kind);
    
    console.log(inputGroups.videoinput!.map(i => i.deviceId));
    setVideoDevices(inputGroups.videoinput ?? []);
    setAudioDevices(inputGroups.audioinput ?? []);
  }
  
  useEffect(() => {
    configureStreamMedia();
    getAllMediaInputs();
  }, []);
  
  const getInputDeviceByKind = (kind: "video" | "audio") => {
    let inputDeviceId = null;

    if ( stream && stream.getTracks().find(t => t.kind === kind) !== null) {
      // Find track that matches the name
      const inputTrack = stream.getTracks().find(t => t.kind === kind);
      if ( !inputTrack ) return null;
      
      (kind === "audio" ? audioDevices : videoDevices).forEach(d => {
        if ( d.label === inputTrack.label ) inputDeviceId = d.deviceId;
      });
    }

    return inputDeviceId;
  }

  const currentVideoDeviceId = getInputDeviceByKind("video");
  console.log(currentVideoDeviceId);
  const currentAudioDeviceId = getInputDeviceByKind("audio");

  return <div className="flex-[2] flex flex-col justify-center gap-4">
    <h1 className="text-4xl font-thin text-gray-600">Setup Devices</h1>
    <div className="h-64 w-96 border-4 border-blue-400 rounded-xl">
      {
        stream && (
          <VideoStream 
            stream={stream}
            isLocal
            playerPosition={[0,0,0]}
            userPosition={[0,0,0]}
            disableDynamicVolume
          />
        )
      }
    </div>
    
    <MediaSelect
      mediaEnabled={isVideoEnabled}
      mediaToggleHandler={setVideoEnabled}
      currentDeviceId={currentVideoDeviceId}
      inputDevices={videoDevices}
      kind="video"
    />

    <MediaSelect
      mediaEnabled={isAudioEnabled}
      mediaToggleHandler={setAudioEnabled}
      currentDeviceId={currentAudioDeviceId}
      inputDevices={audioDevices}
      kind="audio"
    />

    <Button className="bg-blue-500 px-6 mr-auto">
      Join
      <SquarePlus />
    </Button>
  </div>;
}
import { Button } from "@/web/components/ui/button";
import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select } from "@/web/components/ui/select";
import { cn } from "@/web/lib/utils";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";

interface MediaSelectProps {
  mediaEnabled: boolean;
  currentDeviceId: string | null;
  inputDevices: MediaDeviceInfo[];
  mediaToggleHandler: (value: boolean) => void;
  onDeviceChange: (deviceId: string) => void;
  kind: "video" | "audio";
}

export default function MediaSelect({
  mediaEnabled, mediaToggleHandler, currentDeviceId, inputDevices, onDeviceChange, kind,
}: MediaSelectProps) {
  return <div className="flex flex-col gap-1 mb-2 mt-2">
    <div className="flex gap-3 items-center">
      <Button onClick={() => mediaToggleHandler(!mediaEnabled)} variant="outline" className={cn(mediaEnabled ? "bg-rose-400 text-white" : "")}>
        {mediaEnabled ? (
          kind === "audio" ? <Mic /> : <Video />
        ) : (
          kind === "audio" ? <MicOff /> : <VideoOff />
        )}
      </Button>

      <Select
        value={currentDeviceId ?? ""}
        disabled={currentDeviceId === null}
        onValueChange={onDeviceChange}
      >
        <SelectTrigger className="w-[20rem]">
          <SelectValue placeholder="Select device" />
        </SelectTrigger>
        <SelectContent>
          {inputDevices.map(device => (
            <SelectItem key={device.deviceId} value={device.deviceId} className="capitalize">
              {device.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>;
}
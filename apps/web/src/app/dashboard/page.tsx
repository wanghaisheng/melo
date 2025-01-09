import { BackgroundShapes } from "@melo/ui/background-shapes";
import { Button } from "@melo/ui/ui/button";
import { DoorClosed, Plus } from "lucide-react";
import Image from "next/image";

export default function DashboardPage() {

  return (
    <div className="h-full w-full flex flex-col justify-center items-center gap-4">
      <BackgroundShapes count={50} />
      <Image
        src="/static/bg/dashboard_empty.svg"
        alt="Planning illustration"
        height={700}
        width={700}
        className="opacity-80"
      />
      <h1 className="text-5xl text-zinc-600">It's empty around here! </h1>
      <span>Try Creating or joining a room!</span>

      <div className="flex gap-3 items-center">
        <Button className="bg-teal-500 hover:bg-teal-600">
          <Plus />
          Create a new room!
        </Button>
        <span>or</span>
        <Button className="bg-blue-500 hover:bg-blue-600">
          <DoorClosed />
          Join an existing one!
        </Button>

      </div>
    </div>
  );
}


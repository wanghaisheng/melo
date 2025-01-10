"use client";

import { Separator } from "@melo/ui/ui/separator";
import { DoorClosed, Phone } from "lucide-react";
import { useEffect, useState } from "react";

import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "@/web/firebase/init";
import type { FirestoreRoom } from "@melo/types";
import MeloRoomHelpers from "@/web/helpers/room";
import RoomList from "@/web/components/dashboard/room-list";

export default function DashboardPage() {
  const [ rooms, setRooms ] = useState<FirestoreRoom[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, "rooms"), (snapshot) => {
      setRooms(
        snapshot.docs.map(doc => {
          const room = MeloRoomHelpers.extractRoomDataFromDocSnapshot(doc);

          if ( !room ) {
            throw new Error("ERROR: One of the rooms retuned null");
          }

          return room;
        })
      );
    });

    return () => {
      unsubscribe();
    }
  }, []);

  return (
      <div className="h-full w-full flex flex-col items-center gap-4">
        <div className="flex h-full w-full xl:max-w-[70%] xl:min-w-[60%] p-4">
          <div className="flex-[2]">
            <h2 className="text-xl inline-flex items-center gap-2 text-blue-500">
              <DoorClosed />
              Public Rooms
            </h2>
            <RoomList rooms={rooms} />
          </div>
          <Separator orientation="vertical" className="mx-6"/>
          <div className="flex-[1]">
          <h2 className="text-xl inline-flex items-center gap-2 text-rose-500">
              <Phone />
              Call History
            </h2>
          </div>
        </div>
    </div>
  );
}


"use client";

import { useEffect, useState } from "react";

import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "@/web/firebase/init";
import type { FirestoreRoom } from "@melo/types";
import MeloRoomHelpers from "@/web/helpers/room";
import RoomList from "@/web/components/dashboard/room-list";
import JoinWithCodeCard from "@/web/components/dashboard/join-with-code-card";

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
        <div className="flex flex-col lg:flex-row h-full w-full xl:max-w-[70%] xl:min-w-[60%] p-4">
          <div className="flex-[2]">
            <RoomList rooms={rooms} />
          </div>
          <div className="flex-[1] space-y-2">
            <JoinWithCodeCard />
          </div>
        </div>
    </div>
  );
}


"use client";

import { Lock, Users, Calendar } from "lucide-react";
import { Card, CardContent, CardFooter } from "@melo/ui/ui/card";
import { Button } from "@melo/ui/ui/button";
import { Badge } from "@melo/ui/ui/badge";
import { ScrollArea } from "@melo/ui/ui/scroll-area";
import type { FirestoreRoom } from "@melo/types";
import Link from "next/link";

// Room Card Component
const RoomCard = ({ room }: { room: FirestoreRoom }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Card className="w-full transition-all duration-200 hover:shadow-lg">
      <CardContent className="relative p-6 overflow-hidden">
        <div className="flex justify-between items-start mb-2">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold tracking-tight">{room.name}</h3>
            <p className="text-xs underline text-muted-foreground">Room #{room.roomNumber}</p>
          </div>
          {room.hasPassword && (
            <Badge variant="secondary" className="absolute rounded-lg text-rose-500 left-0 top-0 flex gap-1 items-center">
              <Lock className="h-3 w-3" />
              Protected
            </Badge>
          )}
          <Button className="bg-teal-500 hover:bg-teal-600" asChild>
            <Link 
              href={`/room/${room.id}`}
              className="" 
            >
              Join Room
            </Link>
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{room.members.length} members</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Created {formatDate(room.createdOn)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Room List Component
export default function RoomList({ rooms }: { rooms: FirestoreRoom[] }) {
  return (
    <ScrollArea className="h-[calc(100vh-200px)] pr-4">
      <div className="flex flex-col gap-4">
        {rooms.map((room) => (
          <RoomCard key={room.roomNumber} room={room} />
        ))}
      </div>
    </ScrollArea>
  );
}
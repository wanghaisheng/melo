import type { FirestoreRoom } from "@melo/types";
import { addDoc, collection, doc, DocumentSnapshot, Firestore, getDoc, type DocumentData } from "firebase/firestore";
import { hash } from "bcryptjs";

namespace MeloRoomHelpers {
  export function extractRoomDataFromDocSnapshot(room: DocumentSnapshot<DocumentData, DocumentData>): FirestoreRoom | null {
    const roomData = room.data();

    if (!roomData) return null;
    
    return {
      id: room.id,
      roomNumber: roomData.roomNumber,
      createdBy: roomData.createdBy,
      createdOn: new Date(roomData.createdOn),
      hasPassword: roomData.hasPassword,
      password: roomData.password,
      members: roomData.members,
      name: roomData.name,
    }
  }
  
  /**
   * Creates a new room with the specified parameters.
   *
   * @param roomName - The name of the room to be created.
   * @param roomId - The unique identifier for the room.
   * @param createdBy - The user data of the person who is creating the room.
   * @param password - The password for the room, if any. If null, then the room is passwordless.
   * @returns A promise that resolves when the room is successfully created.
   */
  export async function createRoom(
    firestore: Firestore,
    
    roomName: string,
    roomNumber: string,
    createdBy: string,
    password: string | null,
  ): Promise<FirestoreRoom | null> {
    // Password hashing
    let hashedPassword: string | null = null;
    
    if ( password !== null ) {
      hashedPassword = await hash(password, 10);
    }
    
    const roomRef = await addDoc(collection(firestore, "rooms"), {
      name: roomName,
      roomNumber,
      hasPassword: password !== null,
      password: hashedPassword ?? "",
      createdBy,
      createdOn: (new Date()).toUTCString(),
      members: [createdBy],
    });

    const room = await getDoc(roomRef);
    return extractRoomDataFromDocSnapshot(room);
  }

  export async function tryGetRoom(
    firestore: Firestore, 
    roomId: string
  ): Promise<FirestoreRoom | null> {
    try {
      const roomRef = doc(firestore, "rooms", roomId);
      const room = await getDoc(roomRef);

      return extractRoomDataFromDocSnapshot(room);
    } catch(_) {
      return null;
    }
  }
}

export default MeloRoomHelpers;
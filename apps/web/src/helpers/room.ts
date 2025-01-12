import type { FirestoreRoom } from "@melo/types";
import { addDoc, collection, doc, DocumentSnapshot, Firestore, getDoc, getDocs, query, where, type DocumentData } from "firebase/firestore";
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
 
  /**
   * Attempts to retrieve a room document from Firestore by its ID.
   *
   * @param firestore - The Firestore instance to use for the query.
   * @param roomId - The ID of the room to retrieve.
   * @returns A promise that resolves to the room data if found, or null if not found or an error occurs.
   */
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

  export async function tryGetRoomFromNumber(firestore:Firestore, number: string) : Promise<FirestoreRoom | null> {
    try {
      const roomRef = collection(firestore, "rooms");
      const q = query(roomRef, where("roomNumber", "==", number));

      const snapshot = await getDocs(q);
      
      if ( snapshot.docs.length < 0 ) return null;

      return extractRoomDataFromDocSnapshot(snapshot.docs[0]);
    } catch(_) {
      return null;
    }
  }
}

export default MeloRoomHelpers;
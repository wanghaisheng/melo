export type PlayerData = {
  connectionId: string;
  username: string;
  displayName: string;
  position: [number, number, number];
  rotation: [number, number, number];

  // Keep track of whether the video/audio are enabled.
  video: boolean;
  audio: boolean;
  streamStatus: "configure" | "live";
}

export type FirestoreAuthUserData = {
  __auth_uid: string;
  role: "admin" | "user";
  username: string;
  id: string;
}

export type FirestoreRoom = {
  id: string;
  name: string;
  roomNumber: string;
  hasPassword : boolean;
  password: string;
  createdBy: FirestoreAuthUserData;
  createdOn: Date;
  members: string[];
}
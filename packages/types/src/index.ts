export type PlayerData = {
  auth_uid: string;
  connectionId: string;
  username: string;
  displayName: string;
  position: [number, number, number];
  rotation: [number, number, number];

  zone: string; // Room ID basically
  
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

export type ZoneTransferObjectProps = {
  is_to_public: boolean;
  name: string;
  target_pos_x: number;
  target_pos_y: number;
  target_pos_z: number;
  target_zone_name: string;
  zone_name: string;
}

// Knock Request
export type ZoneTransferRequest = {
  requestId: string;
  timestamp: number;
  goToPublic: boolean;
  zone: {
    from: string;
    to: string;
  },
  requestFrom: string;
}

export type ZoneTransferResponse = {
  responseId: string;
  transferRequest: ZoneTransferRequest;
  timestamp: number;
  requestUser: string;
  responseUser: string;
  isAccept: boolean;
}
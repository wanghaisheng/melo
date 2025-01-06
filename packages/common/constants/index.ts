export const WebSocketEvents = {
  // Room related
  EXISTING_USERS: "existing-users",
  USER_JOINED: "user-joined",
  USER_LEFT: "user-left",

  // P2P related
  P2P_OFFER: "offer",
  P2P_ANSWER: "answer",
  P2P_ICE_CANDIDATE: "ice-candidate",
  GLOBAL_PLAYER_DATA_UPDATE: "global-player-data-update",
  PLAYER_DATA_UPDATE: "player-data-update",
  P2P_DISCONNECT: "disconnect",

  // Stream related
  SET_STREAM_PROPERTIES: "set-stream-properties",
}
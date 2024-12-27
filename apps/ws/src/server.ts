import type * as Party from "partykit/server";

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
  }

  onMessage(message: string, sender: Party.Connection) {
  }
}

Server satisfies Party.Worker;

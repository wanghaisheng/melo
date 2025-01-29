import * as Party from "partykit/server";

function tryParseJson(jsonString: string): [object, string | null] {
  try {
    return [JSON.parse(jsonString), null]
  } catch(e) {
    return [{}, "Error Parsing object"]
  }
}

type EventCallback = (data: any, sender: Party.Connection) => void;

export default class BasePartyServer implements Party.Server {
  constructor(readonly room: Party.Room) {}
  
  private events = new Map<string, EventCallback>();
  
  protected on(eventType: string, callback: EventCallback ) {
    if(this.events.get(eventType)) {
      throw new Error(`Event ${eventType} has already been registered.`)
    }
    this.events.set(eventType, callback);
  }

  protected emitAll(eventType: string, msg: object) {
    // For clarity
    this.emitTo(eventType, msg);
  }
  
  protected emitTo(eventType: string,msg: object, to?: string[]) {
    // Custom class to imitate socket.io emit function
    // WHY ? : Because I like it
    if (to === null || to === undefined) {
      // Broadcast to all
      this.room.broadcast(JSON.stringify({
        type: eventType,
        ...msg
      }));
      return;
    }
    
    if (to.length == 1) {
      // For only 1 connection
      this.room.getConnection(to[0])?.send(JSON.stringify({
        type: eventType,
        ...msg
      }));
      return;
    }
    
    // Sends to givens connectionIds
    const conns = this.room.getConnections();
    const ignoreIds = [];
    for ( const conn of conns ) {
      if (!to.includes(conn.id))
        ignoreIds.push(conn.id);
    }

    this.room.broadcast(JSON.stringify({
      type: eventType,
      ...msg,
    }), ignoreIds);
  }

  protected emitWithout(eventType: string, msg: object, without?: string[]) {
    // Basically wrapper for this.room.broadcast
    this.room.broadcast(JSON.stringify({
      type: eventType,
      ...msg
    }), without);
  }

  protected getConnectionIds(ignore?: string[]): string[] {
    const ids = [];
    for ( const conn of this.room.getConnections() ) {
      if (!ignore || !ignore.includes(conn.id))
        ids.push(conn.id);
    }

    return ids;
  }

  protected handleMessage(messageType: string, data: object, sender: Party.Connection) {
    for (const [event, cb] of this.events.entries()) {
      if (event === messageType) {
        cb(data, sender);
        return;
      }
    }
  
    console.error("Invalid event type from user id: ", sender.id);
  }

  onMessage(message: string, sender: Party.Connection) {
    // Ensure JSON parsable
    const [data, error] : [any, string | null] = tryParseJson(message);
    if (error !== null ) {
      return console.log("Couldn't parse json: ", error)
    } 

    this.onBeforeMessageHandler()
    this.handleMessage(data.type, data, sender);
    this.onAfterMessageHandler()
  }

  onBeforeMessageHandler() {}
  onAfterMessageHandler() {}
  }
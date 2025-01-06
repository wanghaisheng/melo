import PartySocket, { type PartySocketOptions } from "partysocket";

type Callback = (data: any) => void;

export default class Socket {
  
  constructor(opts: PartySocketOptions) {
    this.socketOpts = opts;
  }
  
  private socketOpts: PartySocketOptions;
  private events = new Map<string, Callback>();
  private __PartySocket?: PartySocket;
  
  public connect() {
    this.__PartySocket = new PartySocket(this.socketOpts);

    this.__PartySocket.addEventListener("message", ({ data: message }) => {
      const data = JSON.parse(message);
  
      for (const [event, cb] of this.events.entries()) {
        if (event === data.type) {
          cb(data);
          return;
        }
      }
  
      console.error(`Recieved invalid event type: ${data.type}`);
    })
  }

  public isRegistered(event: string) {
    return this.events.has(event);
  }

  // Getters
  get id() {
    if (!this.__PartySocket) throw new Error("ID getter called before socket could initialize");
    
    return this.__PartySocket.id;
  }

  
  on(event: string, callback: Callback) {
    if(this.events.get(event)) {
      console.error(`Event ${event} has already been registered.`)
      return;
    }

    this.events.set(event, callback);
  }

  emit(event: string, payload: object) {
    if (!this.__PartySocket) throw new Error(`Emit called before socket was started for event: ${event} with payload ${JSON.stringify(payload)}`);
    
    this.__PartySocket.send(JSON.stringify({
      type: event,
      ...payload
    }));
  }
}
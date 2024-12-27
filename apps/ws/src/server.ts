import type * as Party from "partykit/server";
import BasePartyServer from "./core/server-base";

import type { UserData } from "@melo/types";

export default class Server extends BasePartyServer implements Party.Server {
  private userData = new Map<string, UserData>();
  
  constructor(readonly room: Party.Room) {
    super(room);

    this.on("offer", (data, conn) => {
      // Offer by broadcasting to the specific user only
      this.emitTo("offer",{
        offer: data.offer,
        from: conn.id,
      }, [data.to]);

    });

    this.on("answer", ({answer, to},conn) => {
      this.emitTo("answer", {
        answer,
        from: conn.id,
      }, [to])
    });

    this.on("ice-candidate", ({ candidate, to }, conn) => {
      this.emitTo("ice-candidate", {
        candidate,
        from: conn.id,
      }, [to]);
    });

    
    this.on("disconnect", (_, conn) => {
      this.emitAll("user-left", {
        id: conn.id,
      });
    });

    this.on("player-data-update", (data, conn) => {
      // Set the individual player's position and then signal the update to all
      // We are sure that the userData entry is already done
      this.userData.set(conn.id, data);      

      this.emitWithout("global-player-data-update", {
        data: Object.fromEntries(this.userData)
      }, []);
    })
  }

  onClose(connection: Party.Connection): void | Promise<void> {
    this.emitAll("user-left", {
      id: connection.id,
    });

    if(this.userData.has(connection.id)) {
      // If has remove
      this.userData.delete(connection.id);
    }

    this.emitAll("global-player-data-update", {
      data: Object.fromEntries(this.userData),
    });
  };

  onConnect(connection: Party.Connection, ctx: Party.ConnectionContext): void | Promise<void> {
    // Assign position
    if(!this.userData.has(connection.id)){
      // Add to the hash map the user data
      this.userData.set(connection.id, {
        connectionId: connection.id,
        username: "User" + Math.floor(Math.random() * 1000),
        displayName: "User" + Math.floor(Math.random() * 1000),
        position: [0,0,0],
        rotation: [0,0,0],
      })
    }

    
    this.emitAll("global-player-data-update", {
      data: Object.fromEntries(this.userData),
    });
    
    this.emitWithout("user-joined", {
      id: connection.id,
    }, []);

    this.emitTo("existing-users", {
      "users": this.getConnectionIds([connection.id]),
    }, [connection.id]);
  }
}

Server satisfies Party.Worker;
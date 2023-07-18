import { Room, Client } from "@colyseus/core";
import { MyRoomState, Player } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;

  onCreate(options: any) {
    this.setState(new MyRoomState());

    
    
    // handle player input
    this.onMessage(0, (client, input) => {
      const player = this.state.players.get(client.sessionId);
  
      this.onMessage(1, (client, message: {xc:number,yc:number }) => {
        player.x = message.xc;
        player.y = message.yc;
       
      });
      if (input.left && input.up) {

        player.animeState = "idle_left";
      } else if (input.right && input.up) {

        player.animeState = "idle_right";
      } else if (input.left && input.down) {

        player.animeState = "idle_left";
      } else if (input.right && input.down) {

        player.animeState = "idle_right";
      } else if (input.left) {

        player.animeState = "idle_left";
      } else if (input.right) {

        player.animeState = "idle_right";
      } else if (input.up) {

        player.animeState = "idle_up";
      } else if (input.down) {

        player.animeState = "idle_down";
      } else {

      }
    });

    // handle chat messages
    this.onMessage("chat", (client, message) => {
      console.log(client.sessionId, "said:", message);

      // broadcast chat message to all clients in the room
      this.broadcast("chat", { id: client.sessionId, message: message });
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");

    const mapWidth = 800;
    const mapHeight = 600;

    const player = new Player();

    player.x = Math.random() * mapWidth;
    player.y = Math.random() * mapHeight;

    this.state.players.set(client.sessionId, player);
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");

    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}

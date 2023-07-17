import { Room, Client } from "@colyseus/core";
import { MyRoomState, Player } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;

  onCreate(options: any) {
    this.setState(new MyRoomState());

    // handle player input
    this.onMessage(0, (client, input) => {
      const player = this.state.players.get(client.sessionId);
      const velocity = 1;
      const halfVelocity = Math.sqrt(Math.pow(velocity, 2) / 2);
      const speed = 200;

      if (input.left && input.up) {
        player.x -= halfVelocity;
        player.y -= halfVelocity;
        player.velX = speed;
        player.velY = speed;
        player.animeState = "idle_left";
      } else if (input.right && input.up) {
        player.x += halfVelocity;
        player.y -= halfVelocity;
        player.velX = speed;
        player.velY = speed;
        player.animeState = "idle_right";
      } else if (input.left && input.down) {
        player.x -= halfVelocity;
        player.y += halfVelocity;
        player.velX = speed;
        player.velY = speed;
        player.animeState = "idle_left";
      } else if (input.right && input.down) {
        player.x += halfVelocity;
        player.y += halfVelocity;
        player.velX = speed;
        player.velY = speed;
        player.animeState = "idle_right";
      } else if (input.left) {
        player.x -= velocity;
        player.velX = speed;
        player.animeState = "idle_left";
      } else if (input.right) {
        player.x += velocity;
        player.velX = speed;
        player.animeState = "idle_right";
      } else if (input.up) {
        player.y -= velocity;
        player.velY = speed;
        player.animeState = "idle_up";
      } else if (input.down) {
        player.y += velocity;
        player.velY = speed;
        player.animeState = "idle_down";
      } else {
        player.velX = 0;
        player.velY = 0;
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

import { Room, Client } from "@colyseus/core";
import { MyRoomState, Player } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;

  onCreate(options: any) {
    this.setState(new MyRoomState());

    this.onMessage(2, (client, message: { name: String }) => {
      const player = this.state.players.get(client.sessionId);

      player.name = message.name;
      console.log(player.name);
    });

    this.onMessage(1, (client, message: { xc: number; yc: number }) => {
      //플레이어의 좌표정보를 받고 저장
      const player = this.state.players.get(client.sessionId);

      player.x = message.xc; //player.x player.y의 값이 바뀌면서 클라이언트의 player.onChange부분이 실행되면서 클라이언트로 좌표정보가 전달됨
      player.y = message.yc;
    });

    // handle player input
    this.onMessage(0, (client, input) => {
      const player = this.state.players.get(client.sessionId);
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
      } else if (input == 'down') {

        player.animeState = "sit_down";
      }else if (input == 'left') {

        player.animeState = "sit_left";
      }else if (input == 'right') {

        player.animeState = "sit_right";
      }else if (input == 'up') {
        
        player.animeState = "sit_up";
      }
      else if (input == 'outofchair') {
        
        player.animeState = "idle_down";
      }
    });

    // handle chat messages
    this.onMessage("chat", (client, message) => {
      console.log(client.sessionId, "said:", message);
      const player = this.state.players.get(client.sessionId);
      // broadcast chat message to all clients in the room
      this.broadcast("chat", { id: player.name, message: message });
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");

    const mapWidth = 800;
    const mapHeight = 600;

    const player = new Player();

    player.x = 1050;
    player.y = 830;

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

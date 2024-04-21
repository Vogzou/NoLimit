<template>
  <div class="head">
    <h1>Lobby</h1>
    <h2>{{roomId}}</h2>
  </div>
  <div class="lobby-container">
    <div class="player-list">
      <div class="player-container">
        <PlayerComponent v-for="p in players" :key="p.SocketId" :player="p.Name" :isCurrentPlayer="p.SocketId === currentPlayer.SocketId"></PlayerComponent>
      </div>
      <div class="create-game-btn">
        <button v-show="currentPlayer.IsAdmin" :disabled="!currentPlayer.IsAdmin" @click="startGame()">Start game</button>
      </div>
    </div>
    <div class="chat">
      <input type="text" class="form-control" placeholder="Your name">
    </div>
  </div>
</template>
<script lang="ts">
import PlayerComponent from "@/components/PlayerComponent.vue";
import socket from "@/services/socket";
import type {Player} from "@/models/Player";
import PlayerService from "@/services/playerService";

export default {
  components: {PlayerComponent},
  data: function(){
    return {
      players: [] as Player[],
      currentPlayer : {} as Player,
      roomId : '',
      socketId : ''
    }
  },
  mounted() {
    socket.on("player-joined", (data: { player : Player, usersInRoom : Player[] }) => {
      console.log("player-joined dans player joined", this.currentPlayer.IsAdmin)
      this.players = data.usersInRoom;
    });
    socket.on("current-player-joined", (data : {player : Player, usersInRoom : any[]}) => {
      this.currentPlayer = data.player;
    });
    socket.on("player-redirected", (data : { roomId : string }) => {
      console.log("Redirecting", this.roomId);
      this.$router.push({name : 'board', params : { roomId : this.roomId, socketId : socket.id}});
    });
    this.fetchData();
  },
  methods:{
    startGame(){
      const data = {
        roomId : this.roomId,
        players : this.players,
        currentPlayer : this.currentPlayer
      }
      socket.emit("redirect-player", data.roomId);
      socket.emit("start-game", data);
      this.$router.push({name : 'board', params : { roomId : this.roomId, socketId : socket.id}});
    },
    async fetchData() {
      try {
        this.socketId = String(this.$route.params.socketId);
        this.roomId = String(this.$route.params.roomId);

        this.players = await PlayerService.fetchPlayers(this.roomId);
        this.currentPlayer = await PlayerService.fetchCurrentPlayer(this.socketId);
      }catch (error){
        console.error("Error fetching data", error);
      }
    }
  }
}
</script>
<style scoped>

  .head{
    text-align: center;
    margin-bottom: 5rem;
  }

  .lobby-container{
    display: flex;

    .player-list{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 70%;

      .create-game-btn{
        display: flex;
        justify-content: center;
        width: 100%;
        button {
          background-color: transparent;
          margin-bottom: 1rem;
          border: solid var(--color-background-ter-game) 2px;
          border-radius: 5px;
          width: 70%;
          padding: 10px 0 10px 0;
          color: var(--color-background-ter-game);
        }
      }
    }
    .chat{
      display: flex;
      align-items: end;
      height: 700px;
      width: 30%;
      background-color: transparent;
      border: solid var(--color-background-ter-game) 1px;
      border-radius: 5px;
      padding: 5px;
    }

    .form-control{
      width: 100%;
      padding: 5px;
    }
  }

</style>

<template>
  <div class="container">
    <div class="head">
      <h1>NO LIMIT</h1>
    </div>
    <div class="form-pseudo">
      <p class="pseudo">Pseudo : {{ playerName }}</p>
      <input type="text" v-model="playerName" class="form-control" placeholder="Your name">
    </div>
    <div class="form-pseudo">
      <p class="pseudo">Code : {{ roomId }}</p>
      <input type="text" v-model="roomId" class="form-control" placeholder="Code room">
    </div>
    <div class="game-btn">
      <div class="create-game-btn">
        <button @click="createRoom()">Create game</button>
      </div>
      <div class="join-game-btn">
        <button @click="joinRoom()">Join game</button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import socket from "@/services/socket";
import { v4 as uuidv4 } from "uuid";

export default {
  data: function(){
    return {
      playerName: '',
      roomId: ''
    }
  },
  methods: {
    createRoom() {
      const roomId = uuidv4();
      const data = {
        roomId : roomId,
        playerName : this.playerName
      }
      socket.emit('create-game', data);
      this.$router.push({name : 'lobby', params : { roomId : data.roomId, socketId : socket.id}});
    },
    joinRoom(){
      const data = {
        roomId : this.roomId,
        playerName : this.playerName
      }
      socket.emit('join-game', data);
      this.$router.push({name : 'lobby', params : { roomId : data.roomId, socketId : socket.id}});
    }
  },
  mounted() {
    socket.on("connect", () => {
      console.log("Client", socket.id);
    })
  }
}
</script>
<style scoped>

  .container{
    display: flex;
    flex-direction: column;
    align-items: center;

    .head{
      text-align: center;
      margin-bottom: 5rem;
    }

    .form-pseudo{
      display: flex;
      width: 50%;
      flex-direction: column;
      align-content: center;

      .pseudo{
        margin-left: 10px;
      }

      .form-control{
        padding: 0.8rem;
        background: rgba(255, 255, 255, 0.70);
        border-radius: 5px;
        border: none;
        font-size: 18px;
      }
    }

    .game-btn{
      margin-top: 4rem;
      display: flex;
      width: 50%;
      flex-direction: column;
      align-content: center;

      .create-game-btn button{
        background-color: transparent;
        margin-bottom: 1rem;
        border: solid var(--color-background-ter-game) 2px;
        border-radius: 5px;
        width: 100%;
        padding: 10px 0 10px 0;
        color: var(--color-background-ter-game);
      }

      .join-game-btn button{
        background-color: var(--color-background-ter-game);
        border: solid var(--color-background-ter-game) 1px;
        border-radius: 5px;
        width: 100%;
        padding: 10px 0 10px 0;
        color: white;
      }
    }
  }
</style>

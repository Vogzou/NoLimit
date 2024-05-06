<template>
  <div>
    <div v-if="isLoading">
      <p>Loading</p>
    </div>
    <div v-else>
      <h2>{{ winner.Name }} gagne la manche et sera le prochain bosse</h2>
      <BlackCardComponent :key="winBlackCard.Id" :card="winBlackCard"></BlackCardComponent>
      <WhiteCardComponent :key="winCard.Id" :card="winCard"></WhiteCardComponent>
      <button @click="onNextTurn()">Next turn</button>
    </div>
  </div>
</template>
<script lang="ts">
import PlayerComponent from "@/components/PlayerComponent.vue";
import socket from "@/services/socket";
import type {Player} from "@/models/Player";
import PlayerService from "@/services/playerService";
import type {WinnerRound} from "@/models/request/WinnerRound";
import WhiteCardComponent from "@/components/WhiteCardComponent.vue";
import type {Card} from "@/models/Card";
import BlackCardComponent from "@/components/BlackCardComponent.vue";

export default {
  components: {BlackCardComponent, WhiteCardComponent, PlayerComponent},
  data: function(){
    return {
      roomId : '',
      winner : {} as Player,
      winCard : {} as Card,
      winBlackCard : {} as Card,
      isLoading : true
    }
  },
  mounted() {
    socket.on("connect", () => {
      const data = {
        roomId : this.roomId
      }
      socket.emit('reconnect-player', data);
    });

    socket.on("winner-info", (data : WinnerRound) => {
      this.winner = data.winner;
      this.winCard = data.winnerCard;
      this.winBlackCard = data.currentBlackCard;
      socket.emit("update-round", data);
    });

    socket.on("round-updated", (data : boolean) => {
      console.log("Data bool", data);
      this.isLoading = data;
    })
  },
  updated() {
    socket.on("connect", () => {
      const data = {
        roomId : this.roomId
      }
      socket.emit('reconnect-player', data);
    });
    socket.on("round-updated", (data : boolean) => {
      console.log("Data bool", data);
        this.isLoading = data;
    })
  },
  methods:{
    onNextTurn() {

    }
  }
}
</script>
<style scoped>
</style>

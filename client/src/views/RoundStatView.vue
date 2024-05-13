<template>
  <div>
    <div v-if="isLoading" class="container">
      <VueSpinnerOrbit size="60" color="#1B998B"></VueSpinnerOrbit>
    </div>
    <div v-else>
      <h2>{{ winner.Name }} gagne la manche et sera le prochain bosse</h2>
      <BlackCardComponent :key="winBlackCard.Id" :card="winBlackCard"></BlackCardComponent>
      <WhiteCardComponent :key="winCard.Id" :card="winCard"></WhiteCardComponent>
    </div>
  </div>
</template>
<script lang="ts">
import PlayerComponent from "@/components/PlayerComponent.vue";
import socket from "@/services/socket";
import type {Player} from "@/models/Player";
import type {WinnerRound} from "@/models/request/WinnerRound";
import WhiteCardComponent from "@/components/WhiteCardComponent.vue";
import type {Card} from "@/models/Card";
import BlackCardComponent from "@/components/BlackCardComponent.vue";
import type {Game} from "@/models/Game";
import {VueSpinnerOrbit} from "vue3-spinners";

export default {
  components: {VueSpinnerOrbit, BlackCardComponent, WhiteCardComponent, PlayerComponent},
  data: function(){
    return {
      roomId : '',
      winner : {} as Player,
      winCard : {} as Card,
      winBlackCard : {} as Card,
      isLoading : true,

      game : {} as Game,
      blackCards : {} as Card[],

      //Gestion du tour
      timerCount : 3,
      playerTurnFinished : false
    }
  },
  mounted() {
    this.roomId = String(this.$route.params.roomId);
    this.playerTurnFinished = false;
    this.onRecoverPlayer();
    this.onWinnerInfo();
    this.onRoundUpdated();
    this.onStartTimer();
    this.onTimerUpdate();
  },
  updated() {
    this.onRecoverPlayer();
    socket.on("round-updated", (data : boolean) => {
      this.isLoading = data;
    });
  },
  beforeUnmount() {
    console.log("Before dest");
    this.onOffSocket();
  },
  beforeRouteLeave(to, from, next) {
    console.log("Before leave");
    this.onOffSocket();
    next();
  },
  methods:{
    onRecoverPlayer() {
      socket.on("connect", () => {
        const data = {
          roomId : this.roomId
        }
        socket.emit('reconnect-player', data);
      });
    },
    onWinnerInfo() {
      socket.on("winner-info", (data : WinnerRound) => {
        this.winner = data.winner;
        this.winCard = data.winnerCard;
        this.winBlackCard = data.currentBlackCard;
        this.blackCards = data.blackCards;
        socket.emit("update-round", data);
      });
    },
    onRoundUpdated() {
      socket.on("round-updated", (data : boolean) => {
        this.isLoading = data;
      });
    },
    onStartTimer() {
      const dataTimer = {
        timer : this.timerCount,
        roomId : this.roomId
      }
      socket.emit("start-timer", dataTimer);
    },
    async onTimerUpdate(){
      socket.on("timer-update", (data : number) => {
        this.timerCount = data;
        console.log(this.timerCount)
        if(this.timerCount == 0){
          this.playerTurnFinished = true;
          this.onNextTurn();
          this.$router.push({name : 'board', params : { roomId : this.roomId}});
        }
      });
    },
    async onNextTurn() {
      try {
        const data = {
          roomId : this.roomId,
          blackCards : this.blackCards
        };
        socket.emit("next-turn", data);
      }catch (error){
        console.error("An error occured", error);
      }
    },
    onOffSocket(){
      socket.off("timer-update");
      socket.off("round-updated");
      socket.off("winner-info");
    }
  }
}
</script>
<style scoped>
.container{
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>

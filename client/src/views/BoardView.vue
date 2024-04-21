<template>
  <div class="head">
    <div class="room-info">
      <h2>{{currentPlayer.Name}}</h2>
      <h3>{{game.CurrentTurnId}}</h3>
    </div>
    <div class="room-timer">
      <span>
        <i class="fa-regular fa-clock"></i>
      </span>
      <h2>24s</h2>
    </div>
    <div class="room-leave-btn">
      <button>Leave room</button>
    </div>
  </div>
  <div class="game-board">
    <div class="game-board-cards-fix">
        <BlackCardComponent></BlackCardComponent>
        <ZoneCardChoosenComponent :card="chosenCard"></ZoneCardChoosenComponent>
    </div>
    <div class="game-board-cards-scrollable">
    </div>
    <div class="score-tab">
      <h3>Score tab</h3>
      <ScoreTabComponent v-for="player in players" :player="player"></ScoreTabComponent>
    </div>
  </div>
  <div class="game-deck">
    <p>Card selected 0/1</p>
    <div class="deck">
      <WhiteCardComponent v-for="card in currentPlayerCards" :key="card.Id" :card="card" @click="confirmCardPlayed(card)"></WhiteCardComponent>
    </div>
  </div>
</template>
<script lang="ts">

import WhiteCardComponent from "@/components/WhiteCardComponent.vue";
import BlackCardComponent from "@/components/BlackCardComponent.vue";
import ZoneCardChoosenComponent from "@/components/ZoneCardChoosenComponent.vue";
import ScoreTabComponent from "@/components/ScoreTabComponent.vue";
import type {Player} from "@/models/Player";
import type {Card} from "@/models/Card";
import PlayerService from "@/services/playerService";
import GameService from "@/services/gameService";
import socket from "@/services/socket";
import CardService from "@/services/cardService";
import type {Game} from "@/models/Game";

export default {
  components: {ZoneCardChoosenComponent, BlackCardComponent, ScoreTabComponent, WhiteCardComponent},
  data : function () {
    return {
      players : [] as Player [],
      currentPlayer : {} as Player,
      socketId : '',
      roomId : '',
      currentPlayerCards : [] as Card[],
      chosenCard : {} as Card,
      game : {} as Game,
      cardsPlayed : [] as Card[]
    }
  },
  mounted() {
    socket.on("game-started", (data: { game : Game}) => {
      this.game = data.game;
      console.log("Game socket", data.game)
      this.fetchData();
    });
    console.log("Game", this.game)
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        this.socketId = String(this.$route.params.socketId);
        this.roomId = String(this.$route.params.roomId);

        this.players = await PlayerService.fetchPlayers(this.roomId);
        this.currentPlayer = await PlayerService.fetchCurrentPlayer(this.socketId);
        const cardIds = this.currentPlayer.Hands.map(c => c.CardId);
        this.currentPlayerCards = await CardService.fetchCardsPlayer(cardIds);
        this.game = await GameService.fetchCurrentGame(this.roomId);
      }catch (error){
        console.error("Error fetching data", error);
      }
    },
    confirmCardPlayed(card: Card) {
      this.chosenCard = card;
    }
  }
}
</script>
<style scoped>
.head{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  .room-info h2{
    color: var(--color-background-secondary-game);
  }

  .room-timer{
    display: flex;
    align-items: center;
  }

  .room-timer i{
    font-size: 24px;
    width: 100%;
    margin-right: 1rem;
  }

  .room-leave-btn button{
    background-color: transparent;
    border: solid var(--color-background-secondary-game) 2px;
    border-radius: 5px;
    padding: 15px 35px 15px 35px;
    color: var(--color-background-secondary-game);
  }
}

.game-board{
  display: flex;
  justify-content: space-between;
  margin-top: 6rem;
  width: 100%;

  .game-board-cards-fix{
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow-x: auto;

    > * {
      margin-right: 1rem;
    }
  }

  .game-board-cards-scrollable{
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow-x: auto;
    width: 45%;
    > * {
      margin: 0 1rem;
    }
  }

  .score-tab{
    width: 20%;
  }
}

.game-deck{

  margin-top: 2rem;

  .deck{
    display: flex;
    margin-top: 1rem;
    border: 4px solid var(--color-background-ter-game);
    border-radius: 10px;
    width: 100%;
    height: 280px;
  }
}
</style>

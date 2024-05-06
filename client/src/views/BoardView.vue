<template>
  <div>
    <template v-if="currentPlayer.IsJudge">
      <div class="head">
        <div class="room-info">
          <h2>{{currentPlayer.Name}}</h2>
          <h3>{{game.CurrentTurnId}}</h3>
        </div>
        <div class="room-timer">
      <span>
        <i class="fa-regular fa-clock"></i>
      </span>
          <h2>{{timerCount}} s</h2>
          <h3 v-if="!playerTurnFinished">Les joueurs choisissent leur carte</h3>
          <h3 v-if="playerTurnFinished">Le juge choisit le gagnant du tour</h3>
        </div>
        <div class="room-leave-btn">
          <button>Leave room</button>
          <button v-if="currentPlayer.IsJudge" @click="nextTurn()">Next turn</button>
        </div>
      </div>
      <div class="game-board">
        <div class="game-board-cards-fix">
          <BlackCardComponent :card="currentBlackCard"></BlackCardComponent>
          <button v-if="currentPlayer.IsJudge && playerTurnFinished" @click="confirmWinCard()">Choisir carte gagnante</button>
          <ZoneCardChoosenComponent v-if="!currentPlayer.IsJudge" :card="chosenCard"></ZoneCardChoosenComponent>
        </div>
        <div class="game-board-cards-scrollable">
          <WhiteCardComponent v-for="card in cardsPlayed" :key="card.Id" :card="card" @click="currentPlayer.IsJudge ? winnerCardSelected(card) : null"></WhiteCardComponent>
        </div>
        <div class="score-tab">
          <h3>Score tab</h3>
          <ScoreTabComponent v-for="player in players" :player="player"></ScoreTabComponent>
        </div>
      </div>
    </template>
    <template v-if="!currentPlayer.IsJudge">
      <div class="head">
        <div class="room-info">
          <h2>{{currentPlayer.Name}}</h2>
          <h3>{{game.CurrentTurnId}}</h3>
        </div>
        <div class="room-timer">
      <span>
        <i class="fa-regular fa-clock"></i>
      </span>
          <h2>{{timerCount}} s</h2>
          <h3 v-if="!playerTurnFinished">Les joueurs choisissent leur carte</h3>
          <h3 v-if="playerTurnFinished">Le juge choisit le gagnant du tour</h3>
        </div>
        <div class="room-leave-btn">
          <button>Leave room</button>
        </div>
      </div>
      <div class="game-board">
        <div class="game-board-cards-fix">
          <BlackCardComponent :card="currentBlackCard"></BlackCardComponent>
          <button v-if="!currentPlayer.IsJudge && !playerTurnFinished" @click="confirmCardPlayed()">Valider</button>
          <ZoneCardChoosenComponent v-if="!currentPlayer.IsJudge" :card="chosenCard"></ZoneCardChoosenComponent>
        </div>
        <div class="game-board-cards-scrollable">
          <WhiteCardComponent v-for="card in cardsPlayed" :key="card.Id" :card="card" @click="currentPlayer.IsJudge ? winnerCardSelected(card) : null"></WhiteCardComponent>
        </div>
        <div class="score-tab">
          <h3>Score tab</h3>
          <ScoreTabComponent v-for="player in players" :player="player"></ScoreTabComponent>
        </div>
      </div>
      <div class="game-deck" v-if="!currentPlayer.IsJudge && !playerTurnFinished">
        <p>Card selected 0/1</p>
        <div class="deck">
          <WhiteCardComponent v-for="card in currentPlayerCards" :key="card.Id" :card="card" @click="cardSelected(card)"></WhiteCardComponent>
        </div>
      </div>
    </template>
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
import type {WinnerRound} from "@/models/request/WinnerRound";
import type {Game} from "@/models/Game";
export default {
  components: {ZoneCardChoosenComponent, BlackCardComponent, ScoreTabComponent, WhiteCardComponent},
  data : function () {
    return {
      //Gestion des joueurs
      players : [] as Player [],
      currentPlayer : {} as Player,

      //Gestion de la game
      socketId : '',
      roomId : '',
      game : {} as Game,

      //Gestion des cartes
      currentPlayerCards : [] as Card[],
      chosenCard : {} as Card,
      cardsPlayed : [] as Card[],
      blackCards : [] as Card[],
      currentBlackCard : {} as Card,
      winCard : {} as Card,

      //Gestion du tour
      timerCount : 5,
      playerTurnFinished : false
    }
  },
  mounted() {

    this.onReconnectPlayer();
    this.startGame();
    this.fetchData();
    this.onCardsPlayed();
    this.onTimerUpdate();

    socket.on("round-room-joined", (data : { roomId : string, winCard : Card }) => {
      const winner : Player | undefined = this.players.find((p : Player) => p.Hands.some(c => c.CardId == data.winCard.Id));
      if(winner) {
        const winnerData: WinnerRound = {
          winnerCard: data.winCard,
          currentPlayer: this.currentPlayer,
          winner: winner,
          roomId: this.roomId,
          blackCards: this.blackCards,
          currentBlackCard : this.currentBlackCard
        }
        socket.emit("winner", winnerData);
        this.$router.push({name : 'round', params : { roomId : data.roomId}});
      }
    });
  },
  updated() {
    socket.on("connect", () => {
      const data = {
        roomId : this.roomId
      }
      socket.emit('reconnect-player', data);
    });
  },
  methods: {
    //Charge toutes les données de la partie
    async fetchData() {
      try {
        this.socketId = String(this.$route.params.socketId);
        this.roomId = String(this.$route.params.roomId);

        this.game = await GameService.fetchCurrentGame(this.roomId);

        this.players = await PlayerService.fetchPlayers(this.roomId);
        this.currentPlayer = await PlayerService.fetchCurrentPlayer(this.socketId);

        const cardIds = this.currentPlayer.Hands.map(c => c.CardId);
        this.currentPlayerCards = await CardService.fetchCardsPlayer(cardIds);
        const currentBlackCard = localStorage.getItem('current-black-card');
        const blackCards = localStorage.getItem('black-cards');
        this.currentBlackCard = JSON.parse(currentBlackCard ?? '{}');
        this.blackCards = JSON.parse(blackCards ?? '{}');
      }catch (error){
        console.error("Error fetching data", error);
      }
    },
    onReconnectPlayer(){
      socket.on("connect", () => {
        const data = {
          roomId : this.roomId
        }
        socket.emit('reconnect-player', data);
      });
    },
    startGame() {
      socket.on("game-started", (data: { game : Game, blackCards : Card[], blackCard : Card}) => {
        //Init des infos de la Game
        this.game = data.game;
        this.blackCards = data.blackCards;
        this.currentBlackCard = data.blackCard;
        localStorage.setItem('current-black-card', JSON.stringify(this.currentBlackCard));
        localStorage.setItem('black-cards', JSON.stringify(this.blackCards));

        //Init du timer
        const dataTimer = {
          timer : this.timerCount,
          roomId : this.roomId
        }
        socket.emit("start-timer", dataTimer);

        //On récupère toutes les données
        this.fetchData();
      });
    },
    onCardsPlayed() {
      socket.on("cards-played", (data: {cardPlayed : Card}) => {
        this.cardsPlayed.push(data.cardPlayed);
      });
    },
    onTimerUpdate(){
      socket.on("timer-update", (data : number) => {
        this.timerCount = data;
        if(this.timerCount == 0){
          this.playerTurnFinished = true;
        }
      });
    },
    //Carte selectionnée du joueur
    cardSelected(card: Card) {
      this.chosenCard = card;
    },

    //Confirmer la carte selectionnée
    confirmCardPlayed() {
      const data = {
        cardPlayed : this.chosenCard,
        roomId : this.roomId,
        currentPlayer: this.currentPlayer
      }
      socket.emit("card-played", data);
      const cardCurrentPlayerIndex = this.currentPlayerCards.indexOf(this.chosenCard);
      this.currentPlayerCards.splice(cardCurrentPlayerIndex, 1);
    },

    //Carte selectionnée par le juge
    winnerCardSelected(card : Card){
      this.winCard = card;
    },

    //Confimer la carte que le juge a selectionne
    //Met à joueur le score et le statut du gagnant
    confirmWinCard() {
      const data = {
        roomId : this.roomId,
        winCard : this.winCard,
        blackCard : this.currentBlackCard
      };
      socket.emit("join-round-room", data);
    }
  },
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
    align-items: center;
    margin-top: 1rem;
    border: 4px solid var(--color-background-ter-game);
    border-radius: 10px;
    width: 100%;
    height: 280px;
  }
}
</style>

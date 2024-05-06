import Card from '../models/card.js';
import Player from '../models/player.js';
export class WinnerRoundRequest {
    winnerCard : Card
    currentPlayer: Player
    winner : Player
    roomId : string | undefined
    blackCards : Card[] | undefined
}

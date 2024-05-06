import type {Card} from "@/models/Card";
import type {Player} from "@/models/Player";

export interface WinnerRound {
    winnerCard : Card,
    currentPlayer: Player,
    winner : Player,
    roomId : string,
    blackCards : Card[],
    currentBlackCard : Card
}

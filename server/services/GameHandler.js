const Card = require("../data/models/card");
const Hand = require("../data/models/hand");
const Player = require("../data/models/player");
const Game = require("../data/models/game");

async function startGame(io, socket, data){
    const deck = await createDeck();
    const blackCards = deck.filter(card => card.Type === 'B');
    const blackCardsUpdated = await generateBlackCard(blackCards);
    await insertPlayerHand(deck, data);
    const game = await Game.findAll({where : {RoomId : data.roomId}});
    const dataGame = {
        game : game,
        blackCards : blackCardsUpdated.blackCards,
        blackCard : blackCardsUpdated.blackCard
    }
    io.to(data.roomId).emit("game-started", dataGame);
}
async function createDeck() {
    const cards = await Card.findAll();
    const whiteCards = cards.filter(card => card.Type === 'W');
    const blackCards = cards.filter(card => card.Type === 'B');
    const deck = [];
    for(let i = 0; i < cards.length - blackCards.length; i++){
        if(blackCards.length > (cards.length / 4)){
            const ranIndex = Math.floor(Math.random() * blackCards.length);
            deck.push(blackCards[ranIndex]);
            blackCards.splice(ranIndex, 1);
        }else{
            const ranIndex = Math.floor(Math.random() * whiteCards.length);
            deck.push(whiteCards[ranIndex]);
            whiteCards.splice(ranIndex, 1);
        }
    }
    return deck;
}

async function insertPlayerHand(deck, data) {
    let cardsWhite = deck.filter(card => card.Type === 'W');
    let cardByPlayer = Math.floor(cardsWhite.length / data.players.length);
    for (const p of data.players) {
        for(let i = 0; i < cardByPlayer; i++){
            const currentCardId = cardsWhite[i].Id;
            await Hand.create({CardId : currentCardId, PlayerId : p.Id});
        }
        cardsWhite.splice(0,cardByPlayer);
    }
}

async function getCardsPlayed(io, socket ,data) {
    io.to(data.roomId).emit("cards-played", data);
}

async function startTimer(io, socket, data){
    console.log("DATA", data);
    setTimeout(() => {
        if(data.timer > 0){
            data.timer--;
            io.to(data.roomId).emit("timer-update", data.timer);
            startTimer(io, socket, data);
        }
    }, 1000);
}

async function generateBlackCard(blackCards) {
    const ranIndex = Math.floor(Math.random());
    const data = {
        blackCard: blackCards[ranIndex],
        blackCards: blackCards
    };
    data.blackCards.splice(ranIndex, 1);
    return data;
}

async function joinRoundRoom(io, socket, data) {
    await updateWinner(data);
    await updateJudge(data);
    io.to(data.roomId).emit("round-room-joined", data);
}

async function updateWinner(data){
    const player = await getPlayerByCardId(data);
    const scorePlayer = player.Score + 50;
    player.set({ Score : scorePlayer});
    player.set({ IsJudge : true});
    await player.save();
}

async function getPlayerByCardId(data){
    const hand = await Hand.findOne({
        where : {CardId : data.winnerCard.Id, PlayerId : data.winner.Id},
        include : Player
    });
    return hand.Player;
}

async function updateJudge(data) {
    const player = await Player.findOne({
        where : {Id : data.currentPlayer.Id}
    });
    player.set({IsJudge : 0});
    await player.save();
}

async function displayWinner(io, socket, data){
    io.to(data.roomId).emit("winner-info", data);
}

async function updateRound(io, socket, data) {
    const roundData = false;
    setTimeout(() => {
        io.to(data.roomId).emit("round-updated", roundData);
    }, 2000);
}

async function nextRound(roomId) {
    try{
        const game = await Game.findOne({where : {RoomId : roomId}});
        const turnId = game.CurrentTurnId + 1;
        game.set({ CurrentTurnId : turnId});
        await game.save();
    }
    catch (error) {
        console.error("Error updating the game:", error);
    }
}

async function nextTurn(io, socket, data) {
    const blackCardsUpdated = await generateBlackCard(data.blackCards);
    const updateGame = await nextRound(data.roomId);
    const dataGame = {
        game : updateGame,
        blackCards : blackCardsUpdated.blackCards,
        blackCard : blackCardsUpdated.blackCard
    }
    io.to(data.roomId).emit("new-turn", dataGame);
}

module.exports = {startGame, getCardsPlayed, startTimer, nextTurn, joinRoundRoom, displayWinner, updateRound};

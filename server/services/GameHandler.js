const Card = require("../data/models/card");
const Hand = require("../data/models/hand");
const Player = require("../data/models/player");
const Game = require("../data/models/game");

async function startGame(io, socket, data){
    const deck = await createDeck(data);
    await insertPlayerHand(deck, data);
    const game = await Game.findAll({where : {RoomId : data.roomId}});
    console.log("Stat ga", game)
    data = {
        game : game
    }
    /*
    const playersHand = await getPlayersHand(data);
    const gameData = {
        playersHand : playersHand,
    }
    players.forEach(player => {
        console.log("Player:", player.dataValues);
        console.log("Hands:");
        player.Hands.forEach(hand => {
            console.log(hand.dataValues);
        });
    });
    //socket.emit("current-player-hand", socketData);
     */
    socket.emit("game-started", data);
    io.to(data.roomId).emit("game-started", data);
}
async function createDeck() {
    const cards = await Card.findAll();
    const deck = [];

    for(let i = 0; i < 5; i++){
        const ranIndex = Math.floor(Math.random() * 5);
        //console.log("RanIndex", ranIndex);
        //console.log("Cards", cards[ranIndex]);
        deck.push(cards[ranIndex]);
        cards.splice(ranIndex, 1);
    }

    return deck;
}

async function insertPlayerHand(deck, data) {
    let cardByPlayer = Math.floor(deck.length / data.players.length);
    for (const p of data.players) {
        for(let i = 0; i < cardByPlayer; i++){
            const currentCardId = deck[i].Id;
            await Hand.create({CardId : currentCardId, PlayerId : p.Id});
        }
        deck.splice(0,cardByPlayer);
    }
}

async function getPlayersHand(data) {
    const playersIds = data.players.map(p => p.Id);

    return await Player.findAll({
        where : {Id : playersIds},
        include : Hand
    });
}

module.exports = {startGame};

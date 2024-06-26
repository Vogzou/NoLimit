const Game = require('../data/models/game');
const Player = require("../data/models/player");
const PlayerGame = require("../data/models/playergame");
const usersInRoom = {};
async function createGame (io, socket, data) {
    const roomId = data.roomId;

    if (!usersInRoom[data.roomId]) {
        usersInRoom[data.roomId] = [];
    }

    try {
        const player = await Player.create({
            Name: data.playerName,
            IsAdmin: true,
            SocketId : socket.id,
            IsJudge : true,
            Score: 0
        });
        console.info("Player created", player.Id);

        const game = await Game.create({
            RoomId: roomId,
            CurrentTurnId: 0
        });
        console.info("Game created", game.Id);

        if(game){
            const gamePlayer = await PlayerGame.create({PlayerId : player.Id, GameId : game.Id});
            console.info("PlayerGame created", gamePlayer.GameId);
            usersInRoom[roomId].push({SocketId: player.SocketId, Name : player.Name, Id: player.Id});
            const socketData = {
                player : player,
                usersInRoom : usersInRoom[roomId]
            };

            socket.join(data.roomId);
            console.info("Room joined", roomId);

            socket.emit("current-player-joined", socketData);
            io.to(roomId).emit("player-joined", socketData);
        }
    }catch (error){
        console.error("Error while creating the game", error);
    }
}

async function joinGame (io, socket, data) {
    const roomId = data.roomId;
    if (!usersInRoom[roomId]) {
        usersInRoom[roomId] = [];
    }

    try{
        const player = await Player.create({
            Name: data.playerName,
            IsAdmin: false,
            SocketId : socket.id,
            IsJudge : false,
            Score: 0
        });
        console.info("Player created", player.Name);

        const game = await Game.findOne({where : {RoomId : roomId}});
        const gamePlayer = await PlayerGame.create({PlayerId : player.Id, GameId : game.Id});
        console.info("PlayerGame created", game.Id);

        usersInRoom[roomId].push({SocketId: player.SocketId, Name : player.Name, Id : player.Id});
        const socketData = {
            player : player,
            usersInRoom : usersInRoom[roomId]
        }

        socket.join(roomId);
        console.info("Room joined", roomId);

        socket.emit("current-player-joined", socketData);
        io.to(roomId).emit("player-joined", socketData);
    }catch (error) {
        console.error("Error while joining the game", error);
    }
}

async function redirectPlayer(io, socket, data) {
    io.to(data.roomId).emit("player-redirected", data);
}

module.exports = {createGame, joinGame, redirectPlayer};

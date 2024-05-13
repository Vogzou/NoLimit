const { Server } = require('socket.io');
const { createGame, joinGame, redirectPlayer } = require('./LobbyHandler');
const { startGame, getCardsPlayed, startTimer, nextTurn, joinRoundRoom, displayWinner, updateRound } = require('./GameHandler');
const { reconnectPlayer } = require('./SocketHandler');
function initializeSocketIO(server){
    const io = new Server(server, {
        connectionStateRecovery : {
            // the backup duration of the sessions and the packets
            maxDisconnectionDuration: 2 * 60 * 1000,
            // whether to skip middlewares upon successful recovery
            skipMiddlewares: true,
        },
        cors : {
            origin : "http://127.0.0.1:5173"
        }
    });
    const onConnection = (socket) => {
        socket.on("disconnect", async (data) => {
            console.log("****************A user has disconnected******************")
        });
        socket.on("create-game", async (data) => {await createGame(io, socket, data)});
        socket.on("join-game", async (data) => {await joinGame(io, socket, data)});
        socket.on("redirect-player", async (data) => {await redirectPlayer(io, socket, data)});
        socket.on("start-game", async (data) => {await startGame(io, socket, data)});
        socket.on("card-played", async (data) => {await getCardsPlayed(io, socket, data)});
        socket.on("start-timer", async (data) => {await startTimer(io, socket, data)});
        socket.on("reconnect-player", async (data) => {await reconnectPlayer(io, socket, data)});
        socket.on("join-round-room", async (data) => {await joinRoundRoom(io, socket, data)});
        socket.on("winner", async (data) => {await displayWinner(io, socket, data)});
        socket.on("update-round", async (data) => {await updateRound(io, socket, data)});
        socket.on("next-turn", async (data) => {await nextTurn(io, socket, data)});
    }
    io.on("connection", onConnection);
}

module.exports = initializeSocketIO;

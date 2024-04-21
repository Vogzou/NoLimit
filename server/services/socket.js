const { Server } = require('socket.io');
const { createGame, joinGame, redirectPlayer } = require('./LobbyHandler');
const { startGame } = require('./GameHandler');
function initializeSocketIO(server){
    const io = new Server(server, {
        cors : {
            origin : "http://127.0.0.1:5173"
        }
    });
    const onConnection = (socket) => {
        socket.on("create-game", async (data) => {await createGame(io, socket, data)});
        socket.on("join-game", async (data) => {await joinGame(io, socket, data)});
        socket.on("redirect-player", async (data) => {await redirectPlayer(io, socket, data)});
        socket.on("start-game", async (data) => {await startGame(io, socket, data)});
    }
    io.on("connection", onConnection);
}

module.exports = initializeSocketIO;

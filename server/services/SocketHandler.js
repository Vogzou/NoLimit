
async function reconnectPlayer(io, socket, data) {
    socket.join(data.roomId);
}

module.exports = {reconnectPlayer};

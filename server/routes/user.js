const express = require('express')
const Game = require("../data/models/game");
const PlayerGame = require("../data/models/playergame");
const Player = require("../data/models/player");
const Hand = require("../data/models/hand");
const router = express.Router()

router.get("/" , (req, res)=> {
    res.status(200).json({message : "Tous les utilisateurs"});
});
router.get("/:roomId", async (req,res) => {
    try{
        const roomId = req.params.roomId;
        const game = await Game.findOne({where : {RoomId : roomId}});
        const gamePlayers = await PlayerGame.findAll({where : {GameId : game.Id}});
        const playersIds = gamePlayers.map(p => p.PlayerId);
        const players = await Player.findAll({
            where : {Id : playersIds},
            include : Hand
        });
        res.status(200).json({players: players});
    }catch (e){
        console.error("Problème dans la route user", e);
    }
});
router.get("/currentUser/:socketId", async (req,res) => {
    const socketId = req.params.socketId;
    const player = await Player.findOne({
        where : {SocketId : socketId},
        include : Hand
    });
    res.status(200).json({currentPlayer: player});
});

module.exports = router;

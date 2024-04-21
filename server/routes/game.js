const express = require('express');
const Game = require("../data/models/game");
const router = express.Router();
router.get("/currentGame/:roomId", async (req,res) => {
    const roomId = req.params.roomId;
    const game = await Game.findOne({where : {RoomId : roomId}});
    res.status(200).json({game: game});
});

module.exports = router;

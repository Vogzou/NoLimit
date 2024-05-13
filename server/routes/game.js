const express = require('express');
const Game = require("../data/models/game");
const router = express.Router();
router.get("/currentGame/:roomId", async (req,res) => {
    const roomId = req.params.roomId;
    const game = await Game.findOne({where : {RoomId : roomId}});
    res.status(200).json({game: game});
});

router.put("/newRound", async (req,res) => {
    const roomId = req.body;

    try{
        const game = await Game.findOne({where : {RoomId : roomId.roomId}});

        if(!game){
            return res.status(404).json({message : "Game not found"});
        }

        const scorePlayer = game.CurrentTurnId + 1;
        game.set({ CurrentTurnId : scorePlayer});
        await game.save();

        res.status(201).json({game : game});
    }catch (error) {
        console.error("Error updating the game:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


module.exports = router;

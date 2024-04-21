const express = require('express');
const Card = require("../data/models/card");
const router = express.Router();
router.get("/playerCards", async (req,res) => {
    const cardIds = Object.values(req.query);
    const cards = await Card.findAll({where : {Id : cardIds}});
    res.status(200).json({cards: cards});
});

module.exports = router;

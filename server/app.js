const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createServer } = require('node:http');
const dbConnection = require('./data/dbConnection');
const users = require("./routes/user");
const cards = require("./routes/card");
const games = require("./routes/game");
const initializeSocketIO = require('./services/socket');

const port = process.env.PORT || 5001
const app = express();
const server = createServer(app);

dbConnection.initialize();

app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use("/users", users);
app.use("/cards", cards);
app.use("/games", games);

initializeSocketIO(server);
server.listen(port, () => {
    console.info("Server running at ")
})

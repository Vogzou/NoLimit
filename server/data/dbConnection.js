const {Sequelize} = require("sequelize");
const Card = require("./models/card");
const Player = require("./models/player");
const Hand = require("./models/hand");
const Turn = require("./models/turn");
const Game = require("./models/game");
const PlayerGame = require("./models/playergame");
class DbConnection{

    constructor() {
        this.sequelize = new Sequelize('NoLimit', 'sa', 'Azerty@123', {
            host: 'localhost',
            dialect: 'mysql'
        });
    }

    async initialize() {
        try {
            await this.sequelize.authenticate().then(() => {
                Card.init(this.sequelize);
                Player.init(this.sequelize);
                Hand.init(this.sequelize);
                Turn.init(this.sequelize);
                Game.init(this.sequelize);
                PlayerGame.init(this.sequelize);

                Card.belongsToMany(Player, {through : Hand});
                Player.belongsToMany(Card, {through : Hand});

                Player.hasMany(Hand, { foreignKey: 'PlayerId' });
                Hand.belongsTo(Player, { foreignKey: 'PlayerId' });

                Player.belongsToMany(Game, {through : 'PlayerGame'});
                Game.belongsToMany(Player, {through : 'PlayerGame'});

                console.log('Connecté à la base');
            });
        } catch (error) {
            console.log('Connexion impossible à la base: ', error);
        }
    }
}

module.exports = new DbConnection();

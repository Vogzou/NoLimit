const {Model, DataTypes} = require('sequelize');
const Card = require("./card");
const Player = require("./player");
class Hand extends Model{
    static async init (sequelizeInstance) {
        super.init({
            CardId: {
                type: DataTypes.INTEGER,
                references: {
                    model: Card, // 'Movies' would also work
                    key: 'Id',
                }
            },
            PlayerId: {
                type: DataTypes.INTEGER,
                references: {
                    model: Player, // 'Movies' would also work
                    key: 'Id',
                }
            },
        }, {
            sequelize: sequelizeInstance,
            modelName: 'Hand',
            freezeTableName: true,
            timestamps: false

        });
        await super.sync()

    }
}

module.exports = Hand

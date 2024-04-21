const {Model, DataTypes} = require('sequelize');

class PlayerGame extends Model {
    static async init(sequelize) {
        super.init({
            PlayerId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey : true,
                references: {
                    model: 'Player',
                    key: 'Id'
                }
            },
            GameId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey : true,
                references: {
                    model: 'Game',
                    key: 'Id'
                }
            }
        }, {
            sequelize,
            modelName: 'PlayerGame',
            freezeTableName: true,
            timestamps: false
        });
        await super.sync();
    }
}
module.exports = PlayerGame;

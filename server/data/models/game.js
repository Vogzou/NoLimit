const {Model, DataTypes} = require('sequelize');
const Turn = require("./turn");
class Game extends Model{
    static async init (sequelizeInstance) {
        super.init({
            Id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            RoomId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            CurrentTurnId: {
                type: DataTypes.INTEGER,
                references: {
                    model: Turn,
                    key: 'Id',
                    foreignKey : true
                }
            }
        }, {
            sequelize: sequelizeInstance,
            modelName: 'Game',
            freezeTableName: true,
            timestamps: false
        });
        await super.sync()
    }
}

module.exports = Game

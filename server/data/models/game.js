const {Model, DataTypes} = require('sequelize');
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
                allowNull: false,
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

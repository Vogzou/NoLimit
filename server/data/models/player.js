const {Model, DataTypes} = require('sequelize');
class Player extends Model{
    static async init (sequelizeInstance) {
        super.init({
            Id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            Name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            IsAdmin: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            SocketId: {
                type: DataTypes.STRING,
                allowNull: false
            },
            Score: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            IsJudge : {
                type: DataTypes.BOOLEAN,
                allowNull: false
            }
        }, {
            sequelize: sequelizeInstance,
            modelName: 'Player',
            freezeTableName: true,
            timestamps: false
        });
        await super.sync()
    }
}

module.exports = Player

const {Model, DataTypes} = require('sequelize');
const Player = require("./player");
const Card = require("./card");
class Turn extends Model {
    static async init(sequelizeInstance) {
        super.init({
            Id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            BlackCardId: {
                type: DataTypes.INTEGER,
                references: {
                    model: Card, // 'Movies' would also work
                    key: 'id',
                    foreignKey : true
                }
            },
            WinnerId: {
                type: DataTypes.INTEGER,
                references: {
                    model: Player, // 'Movies' would also work
                    key: 'id',
                    foreignKey : true
                }
            },
        }, {
            sequelize: sequelizeInstance,
            modelName: 'Turn',
            freezeTableName: true,
            timestamps: false

        });
        await super.sync()

    }
}
module.exports = Turn;

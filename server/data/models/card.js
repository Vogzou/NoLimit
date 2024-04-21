const {Model, DataTypes} = require('sequelize');

class Card extends Model {
    static async init(sequelizeInstance) {
        super.init({
            Id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            Description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            Type: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        }, {
            sequelize: sequelizeInstance,
            modelName: 'Card',
            freezeTableName: true,
            timestamps: false

        });

        await super.sync()
    }
}
module.exports = Card;

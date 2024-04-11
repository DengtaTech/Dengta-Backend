const { Model, DataTypes } = require('sequelize');

const sequelize = require('../../config/db')

class Followship extends Model { }

Followship.init({
    followerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        }
    },
    followeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        }
    }
}, {
    sequelize,
    modelName: 'Followship',
    tableName: 'Followship'
});

module.exports = Followship;
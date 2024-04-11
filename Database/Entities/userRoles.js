const { Model, DataTypes } = require('sequelize');

const sequelize = require('../../config/db')

class UserRole extends Model { }

UserRole.init({
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'Users',
            key: 'id',
        }
    },
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'Roles',
            key: 'id',
        }
    }
}, {
    sequelize,
    modelName: 'UserRole',
    tableName: 'UserRoles'
});

module.exports = UserRole;
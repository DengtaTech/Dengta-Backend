const { Model, DataTypes } = require('sequelize');

const sequelize = require('../../config/db')

class ReactionType extends Model {}

ReactionType.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'ReactionType',
  tableName: 'ReactionType'
});

module.exports = ReactionType;
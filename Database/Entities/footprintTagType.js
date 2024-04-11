const sequelize = require('../../config/db')
const { Model, DataTypes } = require('sequelize');

class FootprintTagType extends Model {}

FootprintTagType.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'FootprintTagType',
  tableName: 'FootprintTagType'
});

module.exports = FootprintTagType;
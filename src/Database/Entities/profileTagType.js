const { Model, DataTypes } = require('sequelize');

const sequelize = require('../../config/db');

class ProfileTagType extends Model {}

ProfileTagType.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'ProfileTagType',
    tableName: 'ProfileTagType',
  }
);

module.exports = ProfileTagType;

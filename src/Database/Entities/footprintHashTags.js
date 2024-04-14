const { Model, DataTypes } = require('sequelize');

const sequelize = require('../../config/db');

class FootprintHashTag extends Model {}

FootprintHashTag.init(
  {
    footprintId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Footprints',
        key: 'id',
      },
    },
    footprintTagTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'FootprintTagType',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'FootprintHashTag',
    tableName: 'FootprintHashTags',
  }
);

module.exports = FootprintHashTag;

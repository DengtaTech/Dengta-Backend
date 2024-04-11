const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/db')

class Footprint extends Model {}

Footprint.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  subtitle: {
    type: DataTypes.STRING(255)
  },
  content: {
    type: DataTypes.TEXT
  },
  titleImage: {
    type: DataTypes.STRING(255)
  },
  totalLike: {
    type: DataTypes.INTEGER
  },
  status: {
    type: DataTypes.STRING(50),
    // allowNull: false
  },
  milestone: {
    type: DataTypes.INTEGER
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: 'Users',
        key: 'id'
    }
  },
}, {
  sequelize,
  modelName: 'Footprint',
  tableName: 'Footprints'
});

module.exports = Footprint;

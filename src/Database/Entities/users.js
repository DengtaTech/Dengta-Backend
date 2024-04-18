const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    accountName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    realName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    birthday: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    provider: {
      type: DataTypes.STRING,
      defaultValue: 'native',
    },
    avatar: {
      type: DataTypes.STRING(255),
    },
    backgroundImage: {
      type: DataTypes.STRING(255),
    },
    gender: {
      type: DataTypes.INTEGER,
    },
    phone: {
      type: DataTypes.STRING(50),
    },
    lifeRole: {
      type: DataTypes.STRING(255),
    },
    selfIntro: {
      type: DataTypes.STRING(255),
    },
    fbLink: {
      type: DataTypes.STRING(255),
    },
    igLink: {
      type: DataTypes.STRING(255),
    },
    linkedInLink: {
      type: DataTypes.STRING(255),
    },
    isActive: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
  }
);

module.exports = User;

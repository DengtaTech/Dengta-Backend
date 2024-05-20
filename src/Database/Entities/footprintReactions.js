// const { Model, DataTypes } = require('sequelize');

// const sequelize = require('../../config/db');

// class FootprintReaction extends Model {}

// FootprintReaction.init(
//   {
//     userId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       primaryKey: true,
//       references: {
//         model: 'Users',
//         key: 'id',
//       },
//     },
//     footprintId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       primaryKey: true,
//       references: {
//         model: 'Footprints',
//         key: 'id',
//       },
//     },
//     reactionTypeId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       primaryKey: true,
//       references: {
//         model: 'ReactionType',
//         key: 'id',
//       },
//     },
//   },
//   {
//     sequelize,
//     modelName: 'FootprintReaction',
//     tableName: 'FootprintReactions',
//   }
// );

// module.exports = FootprintReaction;

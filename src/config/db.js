const { Sequelize } = require('sequelize');
// const EnvironmentManager = require('./envService');
const { createNamespace } = require('cls-hooked');
require('dotenv').config();
const namespace = createNamespace('my-sequelize-namespace');

Sequelize.useCLS(namespace);
// container start order problem
// const MYSQL_DB_NAME = EnvironmentManager.getSecret("MYSQL_DB_NAME");
// const MYSQL_DB_USER = EnvironmentManager.getSecret("MYSQL_DB_USER");
// const MYSQL_DB_PASSWORD = EnvironmentManager.getSecret("MYSQL_DB_PASSWORD");
// const MYSQL_DB_HOST = EnvironmentManager.getSecret("MYSQL_DB_HOST");
// console.log("MYSQL_DB_HOST: ",MYSQL_DB_HOST);

const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
const MYSQL_HOST = process.env.MYSQL_HOST;
const MYSQL_DATABASE = process.env.MYSQL_DATABASE;

const sequelize = new Sequelize(
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
  {
    host: MYSQL_HOST,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

module.exports = sequelize;

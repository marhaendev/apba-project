const { Sequelize } = require('sequelize');
const path = require('path');

const dbPath = path.resolve('..', 'data', 'sqlite', 'database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false // Disable logging for cleaner output
});

module.exports = sequelize;

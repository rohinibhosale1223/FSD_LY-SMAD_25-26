const path = require('path');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const storageFile = process.env.SQLITE_STORAGE || 'database.sqlite';
// place DB file in project folder (one level up from db/)
const storagePath = path.resolve(__dirname, '..', storageFile);

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: storagePath,
  logging: false,
});

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('SQLite DB connected:', storagePath);
  } catch (err) {
    console.error('Unable to connect to SQLite:', err);
    throw err;
  }
}

module.exports = { sequelize, Sequelize, connectDB };

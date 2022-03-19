const { Client } = require('pg');

require('dotenv').config();

const dbClient = {
  host: process.env.HOST,
  port: process.env.DB_PORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  ssl: { rejectUnauthorized: false }
}

module.exports = {
  dbClient,
  Client
};

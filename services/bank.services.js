const crypto = require('crypto');
require('dotenv').config();

const {
  dbClient,
  Client
} = require('../database/database');

class BankService {
  constructor() { }


  async createBank(bankData) {
    // Create DB connection
    const db = new Client(dbClient);
    let result;

    try {
      await db.connect();

      const {
        bnk_name
      } = bankData;

      result = await db.query(`INSERT INTO DB_BANKS(BNK_NAME) VALUES($1) RETURNING *`, [bnk_name]);

      result = result.rows[0];

    } catch(err) {
      result = {
        message: 'Something went wrong'
      }
    } finally {
      await db.end();
    }

    return result;
  }


  async getAllBanks() {
    // Create DB connection
    const db = new Client(dbClient);
    let result;

    try {
      await db.connect();

      result = await db.query(`SELECT * FROM DB_BANKS`);

      result = result.rows;

    } catch(err) {
      result = {
        message: 'Something went wrong'
      }
    } finally {
      await db.end();
    }

    return result;
  }
}

module.exports = BankService;

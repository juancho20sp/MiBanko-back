const crypto = require('crypto');
require('dotenv').config();

const {
  dbClient,
  Client
} = require('../database/database');

class UserService {
  constructor() { }


  async createUser(userData) {
    // Create DB connection
    const db = new Client(dbClient);
    let result;

    try {
      await db.connect();

      const {
        document_number,
        document_type,
        user_name,
        user_lastname,
        role,
      } = userData;

      const creationDate = new Date().toISOString().slice(0, 10);

      result = await db.query(`INSERT INTO DB_USERS(USR_NUMDOC, USR_DOCTYPE, USR_NAME, USR_LASTNAME, USR_ROLE, USR_BIRTHDATE, USR_CREATION_DATE) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`, [document_number,
        document_type.toUpperCase(),
        user_name,
        user_lastname,
        role.toUpperCase(),
        creationDate,
        creationDate]);

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

  async createLogin(userData) {
    // Create DB connection
    const db = new Client(dbClient);
    let result;

    try {
      await db.connect();

      const {
          document_number,
          document_type,
          username,
          email,
          password
      } = userData;

      const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

      result = await db.query(`INSERT INTO DB_LOGIN(USR_NUMDOC, USR_DOCTYPE, USR_USERNAME, USR_EMAIL, USR_PASSWORD) VALUES($1, $2, $3, $4, $5) RETURNING *`, [document_number,
        document_type,
        username,
        email,
        passwordHash]);

      result = result.rows[0];
      delete result.usr_password;


    } catch(err) {
      result = {
        message: 'Something went wrong'
      }
    } finally {
      await db.end();
    }

    return result;
  }


  async getAllUsers() {
    // Create DB connection
    const db = new Client(dbClient);
    let result;

    try {
      await db.connect();

      result = await db.query(`SELECT * FROM DB_USERS INNER JOIN DB_ACCOUNTS ON DB_USERS.USR_NUMDOC = DB_ACCOUNTS.USR_NUMDOC`);

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

  async getUser(documentType, documentNumber) {
    // Create DB connection
    const db = new Client(dbClient);
    let result;

    try {
      await db.connect();

      result = await db.query(`SELECT * FROM DB_USERS WHERE usr_doctype = $1 AND usr_numdoc = $2`, [documentType, documentNumber]);

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

  async getUserBalance(documentType, documentNumber) {
    //database connection
    const db= new Client(dbClient);
    let result;

    try{
        await db.connect();

        result= await db.query(`SELECT acc_balance FROM DB_ACCOUNTS WHERE USR_DOCTYPE = $1 AND USR_NUMDOC = $2`, [documentType, documentNumber]);

        result= result.rows[0];
    }catch(err){
        result = {
            message: 'Something went wrong getting balance bank'
        }
    }finally{
        await db.end();
    }

    return result;
  }
}

module.exports = UserService;

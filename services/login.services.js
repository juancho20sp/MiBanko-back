const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

const {
  dbClient,
  Client
} = require('../database/database');

class LoginService {
  constructor() { }

  // Create and sign the token
  createToken(user) {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { user },
        process.env.JWT_SALT,
        { expiresIn: process.env.JWT_TIME },
        (err, token) => {
            if (err){
                reject(err)
                return
            }

            resolve({
              user: {
                ...user,
                token
              }
            });
        })
    })
  }

  // Refresh the user token
  refreshToken(token) {
    return new Promise((res, rej) => {
      jwt.verify(token, process.env.JWT_SALT, (err, authData) => {
        if (err) {
          rej({
            message: 'El token es inválido'
          })
        }

        const newToken = this.createToken(authData.user);

        newToken.then(response => {
          res({
            ...response
          })
        })
      })
    })
  }

  async getUserLogin(email, password) {
    // Create DB connection
    const db = new Client(dbClient);
    let result;

    try {
      await db.connect();

      const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

      result = await db.query(`SELECT * FROM DB_LOGIN WHERE usr_email = $1 and usr_password = $2`, [email, passwordHash]);

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
}

module.exports = LoginService;

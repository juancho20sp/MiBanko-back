const express = require('express');

// Services
const UserService = require('../services/user.services');
const AccountsService = require('../services/accounts.services');

// Middlewares
const authHandler = require('../middlewares/auth.handler');

const router = express.Router();
const userService = new UserService();
const accountsService = new AccountsService();



router.get('/getAllUsers', async(req, res) => {
  try {
    const users = await userService.getAllUsers();

    res.status(200).json(users);
  } catch(err) {
    res.status(500).json({
      message: 'Something went wrong on the server'
    })
  }
})

router.post('/getUserBalance',
  authHandler,
  async(req, res) => {
    try {
      const {
        usr_doctype,
        usr_numdoc,
      } = req.body;

      const {
        usr_doctype: decoded_usr_doctype,
        usr_numdoc: decoded_usr_numdoc
      } = req.decodedUser;

      if (usr_doctype === decoded_usr_doctype && Number(usr_numdoc) === Number(decoded_usr_numdoc)){
        const users = await userService.getUserBalance(usr_doctype, usr_numdoc);
        return res.status(200).json(users);
      }

      return res.status(401).send('Invalid token');

    } catch(err) {
      res.status(500).json({
        message: 'Something went wrong on the server'
      })
    }
})



/**
 * user: {
 *    document_number: Integer
 *    document_type: String
 *    user_name: String
 *    user_lastname: String
 *    role: String
 * }
 */
router.post('/createUser', async (req, res) => {
  try {
    const data = req.body.user;

    const accountNumber = Math.floor(100000000 + Math.random() * 900000000);

    const newAccountData = {
      acc_number: accountNumber,
      acc_balance: 0,
      acc_type: 'ahorros',
      document_number: data.document_number,
      document_type: data.document_type
    }

    const userData = await userService.createUser(data);
    const loginData = await userService.createLogin(data);
    const accountData = await accountsService.createAccount(newAccountData);

    const result = {
      ...userData,
      ...loginData,
      ...accountData
    }

    delete result.password;

    res.status(200).json(result);
  } catch(err) {
    res.status(500).json({
      message: 'Something went wrong on the server'
    })
  }
})

/**
 * user: {
 *    document_number: Integer
 *    document_type: String
 *    username: String
 *    email: String
 *    password: String
 * }
 */
 router.post('/createLogin', async (req, res) => {
  try {
    const data = req.body.user;


    const userLogin = await userService.createLogin(data);

    res.status(200).json(userLogin);
  } catch(err) {
    res.status(500).json({
      message: 'Something went wrong on the server'
    })
  }
})






module.exports = router;

const express = require('express');

// Services
const UserService = require('../services/user.services');
const AccountsService = require('../services/accounts.services');
const validationsService = require('../validations/validations')
// Middlewares
const {
  verifyToken,
  verifyAdminToken
} = require('../middlewares/auth.handler');

const router = express.Router();
const userService = new UserService();
const accountsService = new AccountsService();
const validations = new validationsService();

/**
 * {
 *  token: Admin token
 * }
 */
router.get('/getAllUsers',
  verifyAdminToken,
  async(req, res) => {
  try {
      const users = await userService.getAllUsers();
      return res.status(200).json(users);

  } catch(err) {
    res.status(500).json({
      message: 'Something went wrong on the server'
    })
  }
})

/**
 * {
 *  token: Token
 * }
 */
router.post('/getUserBalance',
  verifyToken,
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
      if(validations.validateNumerics(decoded_usr_numdoc) && validations.validateNumerics(usr_numdoc)){
        if(validations.validateDocs(decoded_usr_doctype) && validations.validateDocs(usr_doctype)){
          if (usr_doctype === decoded_usr_doctype && Number(usr_numdoc) === Number(decoded_usr_numdoc)){
            const users = await userService.getUserBalance(usr_doctype, usr_numdoc);
            return res.status(200).json(users);
          }
          return res.status(401).send('Invalid token');
        }
        return res.status(400).send("Data user document type is not valid")
      }
      return res.status(400).send("Data user document number is not valid")



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

    if(validations.validateNumerics(accountNumber)){
      if(validations.validateDocs(data.document_type)){
        if(validations.validateNumerics(data.document_number)){
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
        }
        return res.status(400).send("Data user document number is not valid")
      }
      return res.status(400).send("Data user document type is not valid")
    }
    return res.status(400).send("Data account number is not valid")






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
 // TODO: Verify it this is needed
//  router.post('/createLogin', async (req, res) => {
//   try {
//     const data = req.body.user;
//     const userLogin = await userService.createLogin(data);

//     res.status(200).json(userLogin);
//   } catch(err) {
//     res.status(500).json({
//       message: 'Something went wrong on the server'
//     })
//   }
// })






module.exports = router;

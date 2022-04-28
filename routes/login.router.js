const express = require('express');

// Services
const LoginService = require('../services/login.services');
const UserService = require('../services/user.services');
const validationsService = require('../validations/validations')

const router = express.Router();
const service = new LoginService();
const userService = new UserService();
const validations = new validationsService();

/**
 * {
 *    email: String
 *    password: String
 * }
 */
router.post('/', async (req, res) => {
  const {
    email,
    password
  } = req.body;

  if(validations.validateMail(email)){
    try {
      const loginData = await service.getUserLogin(email, password);

      const {
        usr_doctype,
        usr_numdoc
      } = loginData;

      const userData = await userService.getUser(usr_doctype, usr_numdoc);

      const finalData = {
        ...loginData,
        ...userData
      }

      delete finalData.usr_password

      const userToken = await service.createToken(finalData);

      res.status(200).json(userToken);
    } catch(err) {
      res.status(500).json({
        message: 'Something went wrong on the server'
      })
    }
  }
  return res.status(400).send("Data email not valid")
})

/**
 * {
 *    token
 * }
 */
router.post('/refreshToken', async (req, res) => {
  const token = req.body.token;

  try {
    const newToken = await service.refreshToken(token);

    res.status(200).json(newToken);

  } catch(errMsg) {
    res.status(403).json(errMsg)
  }
})



module.exports = router;

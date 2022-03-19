const express = require('express');

// Services
const UserService = require('../services/user.services');

const router = express.Router();
const service = new UserService();


router.get('/getAllUsers', async(req, res) => {
  try {
    const users = await service.getAllUsers();

    res.status(200).json(users);
  } catch(err) {
    res.status(500).json({
      message: 'Something went wrong on the server'
    })
  }
})

router.post('/getUserBalance', async(req, res) => {
  try {
    const {
      usr_doctype,
      usr_numdoc
    } = req.body;

    const users = await service.getUserBalance(usr_doctype, usr_numdoc);

    res.status(200).json(users);
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

    const userData = await service.createUser(data);
    const loginData = await service.createLogin(data);

    const result = {
      ...userData,
      ...loginData
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


    const userLogin = await service.createLogin(data);

    res.status(200).json(userLogin);
  } catch(err) {
    res.status(500).json({
      message: 'Something went wrong on the server'
    })
  }
})






module.exports = router;

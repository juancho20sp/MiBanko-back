const express = require('express');

// Services
const BankService = require('../services/bank.services');
const validationsService = require('../validations/validations')
// Middlewares
const {
  verifyToken,
  verifyAdminToken
} = require('../middlewares/auth.handler');

const router = express.Router();
const service = new BankService();
const validations = new validationsService();

router.post('/', verifyToken, async(req, res) => {
  try {
    const banks = await service.getAllBanks();

    res.status(200).json(banks);
  } catch(err) {
    res.status(500).json({
      message: 'Something went wrong on the server'
    })
  }
})

/**
 * {
 *  bnk_name: String,
 *  token: Admin token
 * }
 */
router.post('/createBank', verifyAdminToken, async (req, res) => {
  const bankData = req.body;

  try {
    if(validations.validateAlphabetic(bankData.bnk_name)){
      const newBank = await service.createBank(bankData);
      res.status(200).json(newBank);
    }
    return res.status(400).send("Characters not permited in bank name")
  } catch(errMsg) {
    res.status(403).json(errMsg)
  }
})

module.exports = router;

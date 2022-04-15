const express = require('express');

// Services
const BankService = require('../services/bank.services');

// Middlewares
const {
  verifyToken,
  verifyAdminToken
} = require('../middlewares/auth.handler');

const router = express.Router();
const service = new BankService();


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

router.post('/', async (req, res) => {
  const bankData = req.body;

  try {
    const newBank = await service.createBank(bankData);

    res.status(200).json(newBank);

  } catch(errMsg) {
    res.status(403).json(errMsg)
  }
})

module.exports = router;

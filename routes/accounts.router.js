const express = require('express');

//Services
const AccountsService = require('../services/accounts.services');

const router = express.Router();
const service = new AccountsService();

/**
 * account: {
 *    document_number: Integer
 *    document_type: String
 *    acc_type: String
 * }
 */
router.post('/getAccount', async (req, res) => {
  try {
    const data = req.body.account;

    const accountData = await service.getAccount(data);

    res.status(200).json(accountData);
  } catch (err) {
    res.status(500).json({
      message: 'Something went wrong on the server',
    });
  }
});

router.get('/getAllAccounts', async (req, res) => {
  try {
    const data = await service.getAllAccounts();

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({
      message: 'Something went wrong on the server',
    });
  }
});

router.get('/getBalanceBank', async (req, res) => {
  try {
    const data = await service.getBalanceBank();

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({
      message: 'Something went wrong on the server',
    });
  }
});

/**
 * account: {
 *    acc_number: Integer
 *    acc_balance: Integer
 *    acc_type: String
 *    document_number: Integer
 *    document_type: String
 * }
 */
router.post('/createAccount', async (req, res) => {
  try {
    const data = req.body.account;

    const accountData = await service.createAccount(data);

    res.status(200).json(accountData);
  } catch (err) {
    res.status(500).json({
      message: 'Something went wrong on the server',
    });
  }
});

/**
 * account: {
 *    document_number: Integer
 *    document_type: String
 *    newAcc_balance: Integer
 * }
 */
router.post('/updateAccount', async (req, res) => {
  try {
    const data = req.body.account;

    const accountData = await service.updateAccount(data);

    res.status(200).json(accountData);
  } catch (err) {
    res.status(500).json({
      message: 'Something went wrong on the server',
    });
  }
});

module.exports = router;

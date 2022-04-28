const express = require('express');

//Services
const AccountsService = require('../services/accounts.services');
const validationsService = require('../validations/validations')
// Middlewares
const {
  verifyToken,
  verifyAdminToken
} = require('../middlewares/auth.handler');

const router = express.Router();
const service = new AccountsService();
const validations = new validationsService();

/**
 * account: {
 *    document_number: Integer
 *    document_type: String
 *    acc_type: String
 * },
 * token: Token
 */
router.post('/getAccount',
  verifyToken,
  async (req, res) => {
    try {
      const data = req.body.account;

      const {
        document_number,
        document_type
      } = data;

      const {
        usr_doctype,
        usr_numdoc
      } = req.decodedUser;

      if(validations.validateNumerics(document_number) && validations.validateNumerics(usr_numdoc)){
        if(validations.validateDocs(document_type) && validations.validateDocs(usr_doctype)){
          if (document_type === usr_doctype && document_number === usr_numdoc){
            const accountData = await service.getAccount(data);
            return res.status(200).json(accountData);
          }
          return res.status(401).send('Invalid token');
        }
        return res.status(400).send('Invalid user document type');
      }
      return res.status(400).send("Invalid user document number")

    } catch (err) {
      res.status(500).json({
        message: 'Something went wrong on the server',
      });
    }
  });

  /**
   * {
   *  token: Admin token
   * }
   */
router.post('/getAllAccounts',
  verifyAdminToken,
  async (req, res) => {
    try {
      const data = await service.getAllAccounts();

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({
        message: 'Something went wrong on the server',
      });
    }
});

/**
 * {
 *  token: Admin token
 * }
 */
router.post('/getBalanceBank',
  verifyAdminToken,
  async (req, res) => {
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
 * },
 * token: Admin token
 */
router.post('/createAccount',
verifyAdminToken,
  async (req, res) => {
    try {
      const data = req.body.account;
      if(validations.validateNumerics(data.acc_number)){
        if(validations.validateNumerics(data.acc_balance)){
          if(validations.validateAccType(data.acc_type)){
            if(validations.validateNumerics(data.document_number)){
              if(validations.validateDocs(data.document_type)){
                const accountData = await service.createAccount(data);
                res.status(200).json(accountData);
              }
              return res.status(400).send('Invalid user document type');
            }
            return res.status(400).send("Invalid user document number")
          }
          return res.status(400).send("Invalid account type data")
        }
        return res.status(400).send("Invalid account balance data")
      }
      return res.status(400).send("Invalid account number data")
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
 *    acc_type: String
 *    acc_numer: Integer
 *    newAcc_balance: Integer
 * },
 * token: Admin token
 */
// TODO -> An user could have two or more accounts
router.post('/updateAccount',
  verifyAdminToken,
  async (req, res) => {
    try {
      const data = req.body.account;
      if(validations.validateNumerics(data.acc_number)){
        if(validations.validateNumerics(data.newAcc_balance)){
          if(validations.validateAccType(data.acc_type)){
            if(validations.validateNumerics(data.document_number)){
              if(validations.validateDocs(data.document_type)){
                const accountData = await service.updateAccount(data);
                res.status(200).json(accountData);
              }
              return res.status(400).send('Invalid user document type');
            }
            return res.status(400).send("Invalid user document number")
          }
          return res.status(400).send("Invalid account type data")
        }
        return res.status(400).send("Invalid account balance data")
      }
      return res.status(400).send("Invalid account number data")

    } catch (err) {
      res.status(500).json({
        message: 'Something went wrong on the server',
      });
    }
});

module.exports = router;

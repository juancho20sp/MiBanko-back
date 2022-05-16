const express = require('express');

const TransctionsService = require('../services/transactions.services');

const validationsService = require('../validations/validations')
// Middlewares
const {
  verifyToken,
  verifyAdminToken
} = require('../middlewares/auth.handler');


const router = express.Router();
const service = new TransctionsService();
const validations = new validationsService();

/**
 * transactionIntra:{
 *  destiny_account: Integer
 *  source_acc: Integer
 *  amount: Integer
 *  typeDocument: String
 *  numDoc: Integer
 *  overdraw: Bool
 *  amount_overdraw: Integer
 * },
 * token: Token
 */

router.post('/createTransactionIntra', verifyToken, async (req, res) => {
  try {
    const data = req.body.transactionIntra;
    if(validations.validateNumerics(data.ndoc)){
      if(validations.validateNumerics(data.amount)){
        if(validations.validateNumerics(data.destiny_account)){
          if(validations.validateNumerics(data.amount_overdraw)){
            if(validations.validateNumerics(data.source_acc)){
              if(validations.validateDocs(data.tdoc)){
                if(validations.validateBools(data.overdraw)){
                  const transactionintraData = await service.createTransactionIntra(data);
                  res.status(200).json(transactionintraData);
                }
                return res.status(400).send("Data overdraw is not valid")
              }
              return res.status(400).send("Data user documet type is not vallid")
            }
            return res.status(400).send("Data source account is not valid")
          }
          return res.status(400).send("Data amount overdraw is not valid")
        }
        return res.status(400).send("Data destiny account is not valid")
      }
      return res.status(400).send("Data amount is not valid")
    }
    return res.status(400).send("Data user number document is not valid")
  } catch(err) {
    res.status(500).json({
      message: 'Something went wrong on the server'
    })
  }
})



/**
 * transactionInter:{
 *  tr_destiny_bank: Integer
 *  tr_destiny_acc: Integer
 *  tr_source_acc: Integer
 *  tr_destiny_receiver_name: String
 *  tr_destiny_receiver_lastName: String
 *  tr_destiny_receiver_typeDoc: String
 *  tr_destiny_receiver_docNum: Integer
 *  amount: Integer
 *  overdraw: Bool
 *  amount_overdraw: Integer
 * },
 * token: Token
 */
 router.post('/createTransactionInter', verifyToken, async (req, res) => {
  try {
    const data = req.body.transactionInter;
    if(validations.validateNumerics(data.tr_destiny_receiver_docNum)){
      if(validations.validateNumerics(data.amount)){
        if(validations.validateNumerics(data.tr_destiny_acc)){
          if(validations.validateNumerics(data.amount_overdraw)){
            if(validations.validateNumerics(data.tr_source_acc)){
              if(validations.validateDocs(data.tr_destiny_receiver_typeDoc)){
                if(validations.validateBools(data.overdraw)){
                  if(validations.validateNumerics(data.tr_destiny_bank)){
                    if(validations.validateAlphabetic(data.tr_destiny_receiver_lastName)){
                      if(validations.validateAlphabetic(data.tr_destiny_receiver_name)){
                        const transactionInterData = await service.createTransactionInter(data);
                        res.status(200).json(transactionInterData);
                      }
                      return res.status(400).send("Data first name is not valid")
                    }
                    return res.status(400).send("Data last name is not valid")
                  }
                  return res.status(400).send("Data bank destiny is not valid")
                }
                return res.status(400).send("Data overdraw is not valid")
              }
              return res.status(400).send("Data user documet type is not vallid")
            }
            return res.status(400).send("Data source account is not valid")
          }
          return res.status(400).send("Data amount overdraw is not valid")
        }
        return res.status(400).send("Data destiny account is not valid")
      }
      return res.status(400).send("Data amount is not valid")
    }
    return res.status(400).send("Data user number document is not valid")
  } catch(err) {
    res.status(500).json({
      message: 'Something went wrong on the server'
    })
  }
});

/**
 * {
 *  token: Admin token
 * }
 */
router.post('/getTransactionsInfo', verifyAdminToken, async(req, res) => {
  try {
    const result = await service.getTransactionsInfo();
    res.status(200).json(result);
  } catch(err) {
    res.status(500).json({
      message: 'Something went wrong on the server'
    })
  }
})

/**
 * {
 *  token: Admin token
 * }
 */
router.post('/getTransactionsDetail', verifyAdminToken, async(req, res) => {
  try {
    const result = await service.getTransactionsDetail();
    res.status(200).json(result);
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
router.post('/getTransactionsUsuario', verifyToken, async(req, res) => {
  try {
    const data = req.body.getData;
    if(validations.validateNumerics(data.account)){
      const result = await service.getTransactionsUsuario(data);
      res.status(200).json(result);
    }
    return res.status.send("Data acccount invalid")
  } catch(err) {
    res.status(500).json({
      message: 'Something went wrong on the server'
    })
  }
})

/**
 * {
 *  token: Admin token
 * }
 */
router.post('/getOverdraws', verifyAdminToken, async(req, res) => {
  try {
    const result = await service.getOverdraws();
    res.status(200).json(result);
  } catch(err) {
    res.status(500).json({
      message: 'Something went wrong on the server'
    })
  }
})

/**
 * {
 *  token: Admin token
 * }
 */
router.put('/setOverdraws', verifyAdminToken, async(req, res) => {
  try {
    const data = req.body.setOverdraw;
    if(validations.validateNumerics(data.id_overdraw)){
      if(validations.validateBools(data.estado)){
        const result = await service.setOverdraws(data);
        res.status(200).json(result);
      }
      return res.status.send("Data status invalid")
    }
    return res.status.send("Data overdraw invalid")
  } catch(err) {
    res.status(500).json({
      message: 'Something went wrong on the server'
    })
  }
})

module.exports = router;

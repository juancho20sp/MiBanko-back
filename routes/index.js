const express = require('express');

const {
  loginRouter,
  userRouter,
  Account_Services,
  accountsRouter,
  transactionsRouter,
  bankRouter
} = require('./routers');

function router(app) {
  const router = express.Router();

  // VERSION 1
  app.use('/api/v1', router);

  router.use('/login', loginRouter);
  router.use('/users', userRouter);
  router.use('/accounts', accountsRouter);
  router.use('/transactions', transactionsRouter);
  router.use('/banks', bankRouter);
}

module.exports = router;

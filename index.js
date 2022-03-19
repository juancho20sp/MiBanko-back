const express = require('express');
const cors = require('cors');

// $
const jwt = require('jsonwebtoken');

require('dotenv').config();

const router = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
router(app);

// $
app.get('/api/login', (req, res) => {
  const user = {
    id: 1,
    name: 'Juan',
    email: 'juan@mail.com'
  }

  // MySecretKey === SALT
  jwt.sign({ user }, 'mySecretKey', {expiresIn: '32s'} ,(err, token) => {
    res.json({
      token
    });
  })

});

// $
app.post('/api/posts', verifyToken, (req, res) => {

  jwt.verify(req.token, 'mySecretKey', (err, authData) => {
    if (err) {
      res.send(403);
    }

    res.json({
      message: 'Post created',
      authData
    })
  })

  res.json({
    message: 'Post created'
  });
});

// $
// Esto es un middleware
function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    const token = bearerHeader.split(' ')[1];
    req.token = token;
    next();
  } else {
    res.sendStatus(403);
  }

}

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
})

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ error: 'Kullanıcı adı veya şifre hatalı' });
  }

  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, {
    expiresIn: '8h',
  });

  res.json({ token });
});

module.exports = router;

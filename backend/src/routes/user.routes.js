const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');

router.get('/profile', authenticate, (req, res) => {
  res.json({ user: req.user.toSafeJSON() });
});

router.put('/profile', authenticate, async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    await req.user.update({ name, phone });
    res.json({ user: req.user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

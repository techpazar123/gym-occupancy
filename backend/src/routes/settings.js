const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

router.post('/capacity', requireAuth, async (req, res) => {
  try {
    const { maxCapacity } = req.body;
    const cap = parseInt(maxCapacity, 10);

    if (!cap || cap < 1) {
      return res.status(400).json({ error: 'maxCapacity en az 1 olmalı' });
    }

    const { rows } = await db.query('SELECT current_count FROM settings WHERE id = 1');
    const newCount = Math.min(rows[0].current_count, cap);

    await db.query(
      'UPDATE settings SET max_capacity = $1, current_count = $2 WHERE id = 1',
      [cap, newCount]
    );

    res.json({ success: true, maxCapacity: cap, currentCount: newCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kapasite güncellenemedi' });
  }
});

module.exports = router;

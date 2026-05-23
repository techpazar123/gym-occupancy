const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT id, card_id, type, timestamp FROM access_logs ORDER BY id DESC LIMIT 50'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kayıtlar alınamadı' });
  }
});

module.exports = router;

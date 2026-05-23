const express = require('express');
const db = require('../db');
const router = express.Router();

function getStatus(rate) {
  if (rate <= 40) return 'Sakin';
  if (rate <= 75) return 'Orta';
  return 'Yoğun';
}

router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT max_capacity, current_count FROM settings WHERE id = 1'
    );
    const row = rows[0];
    const occupancyRate = row.max_capacity > 0
      ? Math.round((row.current_count / row.max_capacity) * 100)
      : 0;

    res.json({
      currentCount: row.current_count,
      maxCapacity: row.max_capacity,
      occupancyRate,
      status: getStatus(occupancyRate),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router;

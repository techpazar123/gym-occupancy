const express = require('express');
const db = require('../db');
const router = express.Router();

router.post('/', async (req, res) => {
  const { cardId, type, timestamp } = req.body;

  if (!cardId || !type || !['entry', 'exit'].includes(type)) {
    return res.status(400).json({ error: 'cardId ve geçerli bir type ("entry" veya "exit") gerekli' });
  }

  const ts = timestamp || new Date().toISOString();
  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      'SELECT max_capacity, current_count FROM settings WHERE id = 1 FOR UPDATE'
    );
    const settings = rows[0];
    const newCount = type === 'entry'
      ? Math.min(settings.current_count + 1, settings.max_capacity)
      : Math.max(settings.current_count - 1, 0);

    await client.query('UPDATE settings SET current_count = $1 WHERE id = 1', [newCount]);
    await client.query(
      'INSERT INTO access_logs (card_id, type, timestamp) VALUES ($1, $2, $3)',
      [cardId, type, ts]
    );

    await client.query('COMMIT');
    res.json({ success: true, currentCount: newCount });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Kayıt sırasında hata oluştu' });
  } finally {
    client.release();
  }
});

module.exports = router;

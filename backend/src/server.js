require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDb } = require('./db');

const occupancyRouter = require('./routes/occupancy');
const accessRouter = require('./routes/access');
const logsRouter = require('./routes/logs');
const settingsRouter = require('./routes/settings');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((s) => s.trim())
  : ['http://localhost:5173'];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Public
app.use('/api/auth', authRouter);
app.use('/api/occupancy', occupancyRouter);
app.use('/api/access', accessRouter);

// Admin (token gerekli)
app.use('/api/logs', logsRouter);
app.use('/api/settings', settingsRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint bulunamadı' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Sunucu hatası' });
});

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Gym Occupancy API çalışıyor: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Veritabanı başlatılamadı:', err.message);
    process.exit(1);
  });

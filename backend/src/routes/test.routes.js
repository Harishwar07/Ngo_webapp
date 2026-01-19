import express from 'express';
import { db } from '../config/db.js';

const router = express.Router();

router.get('/ping-db', async (req, res) => {
  const [rows] = await db.query('SELECT NOW() AS server_time');
  res.json({
    status: 'success',
    mysql_time: rows[0].server_time
  });
});

export default router;

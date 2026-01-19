import { db } from './db.js';

(async () => {
  const [rows] = await db.query('SELECT 1');
  console.log('✅ MySQL Connected', rows);
})();

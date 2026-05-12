require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
  const cfg = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'catalogo_db'
  };

  let conn;
  try {
    conn = await mysql.createConnection(cfg);
  } catch (err) {
    console.error('ERROR: No se pudo conectar a MySQL:', err.message);
    process.exit(2);
  }

  try {
    const [rows] = await conn.execute('SELECT COUNT(*) AS cnt FROM productos');
    const count = rows[0].cnt;
    console.log('Total productos:', count);

    const [examples] = await conn.execute('SELECT id, nombre, precio, disponibilidad, categoria, url FROM productos ORDER BY id DESC LIMIT 10');
    console.table(examples);

    process.exit(0);
  } catch (err) {
    console.error('ERROR consultando productos:', err.message);
    process.exit(3);
  } finally {
    if (conn) await conn.end();
  }
})();

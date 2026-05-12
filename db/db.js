require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "catalogo_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelayMs: 0
});

// Verificar conexión al iniciar
pool.getConnection()
    .then(conn => {
        console.log("✅ Conexión a MySQL exitosa");
        conn.release();
    })
    .catch(err => {
        console.error("❌ Error conectando a MySQL:", err.message);
        console.error("   Verifica que MySQL está corriendo y las credenciales son correctas.");
        console.error("   Credenciales siendo usadas:");
        console.error("   - Host:", process.env.DB_HOST || "localhost");
        console.error("   - Port:", process.env.DB_PORT || 3306);
        console.error("   - User:", process.env.DB_USER || "root");
        console.error("   - Password:", process.env.DB_PASSWORD ? "***" : "(vacía)");
        console.error("   - Database:", process.env.DB_NAME || "catalogo_db");
    });

module.exports = pool;

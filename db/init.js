const pool = require("./db");

const initDatabase = async () => {
    try {
        const connection = await pool.getConnection();
        
        const dbName = process.env.DB_NAME || 'catalogo_db';
        console.log("📦 Asegurando base de datos:", dbName);

        // Crear base de datos si no existe
        await connection.query(`
            CREATE DATABASE IF NOT EXISTS \`${dbName}\`
        `);
        console.log(`✅ Base de datos '${dbName}' lista`);

        // Cambiar a la base de datos
        await connection.query(`USE \`${dbName}\``);

        console.log("📦 Creando tabla de productos...");
        
        // Crear tabla de productos (compatible con libros de books.toscrape.com)
        await connection.query(`
            CREATE TABLE IF NOT EXISTS productos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(255) NOT NULL,
                precio DECIMAL(10, 2) NOT NULL,
                disponibilidad VARCHAR(100) NOT NULL,
                categoria VARCHAR(100) DEFAULT 'General',
                url VARCHAR(512) DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_categoria (categoria)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        console.log("✅ Tabla 'productos' lista");

        // Migraciones simples: asegurar columna 'nombre' y migrar desde 'titulo' si existe
        try {
            const [tituloRows] = await connection.query("SELECT COUNT(*) as cnt FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='productos' AND COLUMN_NAME='titulo'");
            const tituloExists = tituloRows[0].cnt > 0;

            const [nombreRows] = await connection.query("SELECT COUNT(*) as cnt FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='productos' AND COLUMN_NAME='nombre'");
            const nombreExists = nombreRows[0].cnt > 0;

            if (!nombreExists) {
                console.log("➕ Agregando columna 'nombre' a 'productos'");
                await connection.query("ALTER TABLE productos ADD COLUMN nombre VARCHAR(255) DEFAULT 'Sin nombre'");
            }

            if (tituloExists) {
                console.log("🔁 Migrando datos desde 'titulo' a 'nombre' (si aplica)");
                try {
                    await connection.query("UPDATE productos SET nombre = titulo WHERE (nombre IS NULL OR nombre = '' OR nombre = 'Sin nombre') AND titulo IS NOT NULL");
                } catch (upErr) {
                    console.warn("⚠️ Error actualizando valores de 'nombre':", upErr.message);
                }

                // Intentar eliminar columna antigua (si la versión de MySQL lo soporta)
                try {
                    await connection.query("ALTER TABLE productos DROP COLUMN titulo");
                    console.log("✅ Columna 'titulo' eliminada");
                } catch (err) {
                    console.warn("⚠️ No se pudo eliminar columna 'titulo' (posiblemente versión antigua de MySQL):", err.message);
                }
            }
        } catch (migErr) {
            console.warn("⚠️ Error durante migración de columnas:", migErr.message);
        }

        connection.release();

        console.log("✅ Base de datos inicializada correctamente\n");
        return true;
        
    } catch (error) {
        console.error("❌ Error inicializando BD:", error.message);
        console.error("   Verifica que MySQL está ejecutándose.");
        return false;
    }
};

module.exports = initDatabase;

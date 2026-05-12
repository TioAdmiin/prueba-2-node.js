const pool = require("../db/db");

/**
 * Guardar múltiples productos en la BD
 * @param {Array} productos - Array con {titulo, precio, disponibilidad, categoria?, url?}
 * @returns {Promise} Resultado de la inserción
 */
const guardarProductos = async (productos) => {
    if (!Array.isArray(productos) || productos.length === 0) {
        throw new Error("Debe proporcionar un array de productos válido");
    }

    try {
        const connection = await pool.getConnection();
        
        // Preparar query de inserción múltiple (guardamos en columna `nombre` para compatibilidad)
        const query = "INSERT INTO productos (nombre, precio, disponibilidad, categoria, url) VALUES ?";
        const values = productos.map(p => {
            // Limpiar y convertir precio a número (ej. '£51.77' -> 51.77)
            const raw = p.precio || "0";
            const cleaned = String(raw).replace(/[^0-9.,-]/g, '').replace(',', '.');
            const precioNum = parseFloat(cleaned) || 0;

            return [
                p.titulo || p.nombre || 'Sin nombre',
                precioNum,
                p.disponibilidad || '',
                p.categoria || 'General',
                p.url || null
            ];
        });
        
        const result = await connection.query(query, [values]);
        connection.release();
        
        return {
            insertados: result[0].affectedRows,
            ultimoId: result[0].insertId
        };
    } catch (error) {
        throw new Error("Error guardando productos: " + error.message);
    }
};

/**
 * Obtener estadísticas de todos los productos
 * @returns {Promise} {cantidad, precioMin, precioMax, precioPromedio}
 */
const obtenerStats = async () => {
    try {
        const connection = await pool.getConnection();
        
        const query = `
            SELECT 
                COUNT(*) as cantidad,
                MIN(precio) as precioMin,
                MAX(precio) as precioMax,
                AVG(precio) as precioPromedio
            FROM productos
        `;
        
        const result = await connection.query(query);
        connection.release();
        
        return {
            cantidad: result[0][0].cantidad,
            precioMin: parseFloat(result[0][0].precioMin) || 0,
            precioMax: parseFloat(result[0][0].precioMax) || 0,
            precioPromedio: parseFloat(result[0][0].precioPromedio) || 0
        };
    } catch (error) {
        throw new Error("Error obteniendo estadísticas: " + error.message);
    }
};

/**
 * Buscar productos por categoría
 * @param {String} categoria - Nombre de la categoría
 * @returns {Promise} Array de productos
 */
const buscarPorCategoria = async (categoria) => {
    if (!categoria || categoria.trim() === "") {
        throw new Error("La categoría no puede estar vacía");
    }

    try {
        const connection = await pool.getConnection();
        
        const query = `
                SELECT * FROM productos 
                WHERE categoria = ? 
                ORDER BY nombre
            `;
        
            const result = await connection.query(query, [categoria]);
        connection.release();
        
        return result[0];
    } catch (error) {
        throw new Error("Error buscando por categoría: " + error.message);
    }
};

/**
 * Obtener todos los productos
 * @returns {Promise} Array de todos los productos
 */
const obtenerTodos = async () => {
    try {
        const connection = await pool.getConnection();
        
        const query = "SELECT * FROM productos ORDER BY id DESC";
        
        const result = await connection.query(query);
        connection.release();
        
        return result[0];
    } catch (error) {
        throw new Error("Error obteniendo productos: " + error.message);
    }
};

/**
 * Limpiar tabla de productos (útil para reiniciar)
 * @returns {Promise} Resultado de la eliminación
 */
const limpiarProductos = async () => {
    try {
        const connection = await pool.getConnection();
        
        const query = "DELETE FROM productos";
        
        const result = await connection.query(query);
        connection.release();
        
        return {
            eliminados: result[0].affectedRows
        };
    } catch (error) {
        throw new Error("Error limpiando productos: " + error.message);
    }
};

module.exports = {
    guardarProductos,
    obtenerStats,
    buscarPorCategoria,
    obtenerTodos,
    limpiarProductos
};

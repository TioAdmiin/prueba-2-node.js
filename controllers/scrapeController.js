const { getScrapedData } = require("../services/scrapeService");
const { guardarProductos, obtenerStats, buscarPorCategoria } = require("../models/productoModel");

/**
 * GET /scrape - Scrapear sin guardar (solo lectura)
 */
const scrapeData = async (req, res) => {
    try {
        const data = await getScrapedData();

        if (!data || data.length === 0) {
            return res.status(404).json({
                ok: false,
                error: "No se encontraron datos"
            });
        }

        res.status(200).json({
            ok: true,
            cantidad: data.length,
            datos: data
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            error: "Error interno del servidor",
            detalle: error.message
        });
    }
};

/**
 * POST /api/catalogo/importar - Scrapear y guardar en BD
 */
const importarCatalogo = async (req, res) => {
    try {
        const data = await getScrapedData();

        if (!data || data.length === 0) {
            return res.status(400).json({
                ok: false,
                error: "No se encontraron elementos .product_pod en el HTML"
            });
        }

        // Guardar en BD
        const resultado = await guardarProductos(data);

        res.status(201).json({
            ok: true,
            mensaje: "Productos importados correctamente",
            importados: resultado.insertados,
            ultimoId: resultado.ultimoId
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            error: "Error importando productos",
            detalle: error.message
        });
    }
};

/**
 * GET /api/catalogo/stats - Estadísticas de productos
 */
const verStats = async (req, res) => {
    try {
        const stats = await obtenerStats();

        res.status(200).json({
            ok: true,
            stats: {
                cantidad: stats.cantidad,
                precioMinimo: "$" + stats.precioMin.toFixed(2),
                precioMaximo: "$" + stats.precioMax.toFixed(2),
                precioPromedio: "$" + stats.precioPromedio.toFixed(2)
            }
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            error: "Error obteniendo estadísticas",
            detalle: error.message
        });
    }
};

/**
 * GET /api/catalogo/buscar - Buscar productos por categoría
 */
const buscarProductos = async (req, res) => {
    try {
        const { categoria } = req.query;

        if (!categoria || categoria.trim() === "") {
            return res.status(400).json({
                ok: false,
                error: "La categoría no puede estar vacía",
                ejemplo: "GET /api/catalogo/buscar?categoria=Available"
            });
        }

        const productos = await buscarPorCategoria(categoria);

        if (productos.length === 0) {
            return res.status(404).json({
                ok: false,
                error: "No se encontraron productos con esa categoría"
            });
        }

        res.status(200).json({
            ok: true,
            cantidad: productos.length,
            categoria: categoria,
            productos: productos
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            error: "Error buscando productos",
            detalle: error.message
        });
    }
};

module.exports = {
    scrapeData,
    importarCatalogo,
    verStats,
    buscarProductos
};
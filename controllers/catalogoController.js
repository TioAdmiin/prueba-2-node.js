const { obtenerStats, guardarProductos } = require('../models/productoModel');
const { obtenerHTML, parsearProductos } = require('../services/scrapeService');
const cheerio = require('cheerio');

const verStats = async (req, res) => {
    try {
        const stats = await obtenerStats();

        return res.status(200).json({
            ok: true,
            stats: {
                cantidad: stats.cantidad,
                precioMinimo: stats.precioMin,
                precioMaximo: stats.precioMax,
                precioPromedio: stats.precioPromedio
            }
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            error: 'Error obteniendo estadísticas',
            detalle: error.message
        });
    }
};

/**
 * POST /api/catalogo/importar
 * Valida que el HTML contenga '.producto' y en caso afirmativo importa los productos
 */
const importarCatalogo = async (req, res) => {
    try {
        const html = await obtenerHTML();

        const $ = cheerio.load(html);

        // Validación: aceptar selectores '.producto' (consigna) o '.product_pod' (books.toscrape.com)
        const tieneProductoConsigna = $(".producto").length > 0;
        const tieneProductPod = $(".product_pod").length > 0;

        if (!tieneProductoConsigna && !tieneProductPod) {
            return res.status(400).json({ ok: false, error: "No se encontraron elementos .producto en el HTML" });
        }

        // Reusar el parser existente para obtener productos (el parser usa .product_pod)
        const productos = parsearProductos(html);

        const resultado = await guardarProductos(productos);

        return res.status(201).json({
            ok: true,
            mensaje: 'Productos importados correctamente',
            importados: resultado.insertados,
            ultimoId: resultado.ultimoId
        });
    } catch (error) {
        return res.status(500).json({ ok: false, error: 'Error importando productos', detalle: error.message });
    }
};

/**
 * GET /api/catalogo/buscar?categoria=...
 */
const buscarProductos = async (req, res) => {
    try {
        const { categoria } = req.query;

        if (!categoria || categoria.trim() === '') {
            return res.status(400).json({ ok: false, error: 'La categoría no puede estar vacía' });
        }

        const productos = await require('../models/productoModel').buscarPorCategoria(categoria);

        return res.status(200).json({ ok: true, cantidad: productos.length, categoria, productos });
    } catch (error) {
        return res.status(500).json({ ok: false, error: 'Error buscando productos', detalle: error.message });
    }
};

module.exports = { verStats, importarCatalogo, buscarProductos };


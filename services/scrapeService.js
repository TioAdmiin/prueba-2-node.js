const axios = require("axios");
const cheerio = require("cheerio");

/**
 * Obtener HTML desde URL remota
 * @returns {Promise<String>} HTML de la página
 */
const obtenerHTML = async () => {
    const url = "https://books.toscrape.com/";

    try {
        const response = await axios.get(url);

        if (!response.data) {
            throw new Error("HTML vacío");
        }

        return response.data;
    } catch (error) {
        throw new Error("Error obteniendo HTML: " + error.message);
    }
};

/**
 * Parsear HTML y extraer productos
 * @param {String} html - HTML a parsear
 * @returns {Array} Array de productos parseados
 */
const parsearProductos = (html) => {
    try {
        const $ = cheerio.load(html);
        const results = [];

        // Validación: verificar si existen elementos
        if ($(".product_pod").length === 0) {
            throw new Error("No se encontraron elementos .product_pod en el HTML");
        }

        $(".product_pod").each((index, element) => {
            if (index < 5) {
                const title = $(element).find("h3 a").attr("title");
                const href = $(element).find("h3 a").attr("href");
                // Normalizar URL relativa
                const url = href ? new URL(href, "https://books.toscrape.com/").href : null;

                results.push({
                    titulo: title,
                    precio: $(element).find(".price_color").text(),
                    disponibilidad: $(element)
                        .find(".availability")
                        .text()
                        .trim(),
                    categoria: "Books",
                    url
                });
            }
        });

        if (results.length === 0) {
            throw new Error("No se extrajeron productos del HTML");
        }

        return results;
    } catch (error) {
        throw new Error("Error parseando HTML: " + error.message);
    }
};

/**
 * Scrapear y retornar datos sin guardar
 * @returns {Promise<Array>} Productos scrapeados
 */
const getScrapedData = async () => {
    try {
        const html = await obtenerHTML();
        const productos = parsearProductos(html);
        return productos;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getScrapedData,
    obtenerHTML,
    parsearProductos
};
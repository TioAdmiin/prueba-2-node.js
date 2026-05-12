const axios = require("axios");
const cheerio = require("cheerio");

const getScrapedData = async () => {
    const url = "https://books.toscrape.com/";

    try {
        const response = await axios.get(url);

        if (!response.data) {
            throw new Error("HTML vacío");
        }

        const $ = cheerio.load(response.data);
        const results = [];

        $(".product_pod").each((index, element) => {
            if (index < 5) {
                results.push({
                    titulo: $(element).find("h3 a").attr("title"),
                    precio: $(element).find(".price_color").text(),
                    disponibilidad: $(element)
                        .find(".availability")
                        .text()
                        .trim()
                });
            }
        });

        if (results.length === 0) {
            throw new Error("No se encontraron resultados");
        }

        return results;

    } catch (error) {
        throw new Error("Error obteniendo HTML: " + error.message);
    }
};

module.exports = { getScrapedData };
const { getScrapedData } = require("../services/scrapeService");

const scrapeData = async (req, res) => {
    try {
        const data = await getScrapedData();

        if (!data || data.length === 0) {
            return res.status(404).json({
                error: "No se encontraron datos"
            });
        }

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor",
            detalle: error.message
        });
    }
};

module.exports = { scrapeData };
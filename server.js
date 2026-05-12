const express = require("express");
const scrapeRoutes = require("./routes/scrapeRoutes");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/", scrapeRoutes);

// Manejo de rutas inexistentes
app.use((req, res) => {
    res.status(404).json({
        error: "Ruta no encontrada"
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
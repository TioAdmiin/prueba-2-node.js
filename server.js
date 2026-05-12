const express = require("express");
const scrapeRoutes = require("./routes/scrapeRoutes");
const catalogoRoutes = require("./routes/catalogoRoutes");
const initDatabase = require("./db/init");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/", scrapeRoutes);
app.use('/api/catalogo', catalogoRoutes);

// Manejo de rutas inexistentes
app.use((req, res) => {
    res.status(404).json({
        error: "Ruta no encontrada"
    });
});

// Inicializar BD y arrancar servidor
initDatabase().then((success) => {
    if (success) {
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
            console.log(`📝 Endpoints disponibles:`);
            console.log(`   GET  /scrape - Scrapear datos (sin guardar)`);
            console.log(`   POST /api/catalogo/importar - Importar a BD`);
            console.log(`   GET  /api/catalogo/stats - Estadísticas`);
            console.log(`   GET  /api/catalogo/buscar?categoria=X - Buscar por categoría\n`);
        });
    } else {
        console.error("\n❌ No se pudo inicializar la base de datos.");
        console.error("   Asegúrate de que MySQL está ejecutándose.\n");
        process.exit(1);
    }
}).catch(err => {
    console.error("❌ Error fatal:", err.message);
    process.exit(1);
});
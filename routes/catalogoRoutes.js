const express = require('express');
const router = express.Router();
const Ctrl = require('../controllers/catalogoController');

// GET /api/catalogo/stats
router.get('/stats', Ctrl.verStats);
// POST /api/catalogo/importar
router.post('/importar', Ctrl.importarCatalogo);
// GET /api/catalogo/buscar
router.get('/buscar', Ctrl.buscarProductos);

module.exports = router;

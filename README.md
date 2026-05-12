# Prueba 2 - Catalogo y Scraping

Una pequeña aplicación Node.js/Express que realiza scraping de datos y gestiona un catálogo de productos en una base de datos.

## Descripción
El proyecto expone endpoints para obtener datos mediante scraping (sin guardar) y para importar, buscar y consultar estadísticas del catálogo almacenado en la base de datos.

La estructura principal del proyecto:

- `server.js` - punto de entrada y configuración de rutas.
- `controllers/` - controladores HTTP (`catalogoController.js`, `scrapeController.js`).
- `routes/` - rutas de la API (`catalogoRoutes.js`, `scrapeRoutes.js`).
- `services/` - lógica de scraping (`scrapeService.js`).
- `models/` - modelos de datos (`productoModel.js`).
- `db/` - inicialización y conexión a la base de datos (`db.js`, `init.js`).
- `scripts/` - utilidades y scripts auxiliares (`query_products.js`).

## Requisitos

- Node.js (v14+ recomendable)
- npm
- Base de datos (configurada según `db/init.js`), asegúrate de tener la base de datos corriendo antes de iniciar la app.

## Instalación

1. Clona el repositorio o copia los archivos al equipo.
2. Desde la raíz del proyecto, instala dependencias:

```bash
npm install
```

## Ejecución

Inicia la aplicación con:

```bash
node server.js
```

Por defecto el servidor arranca en `http://localhost:3000` (puedes cambiar el puerto con la variable de entorno `PORT`).

## Endpoints principales

- GET  /scrape
  - Ejecuta el scraping y devuelve los datos (lectura, no guarda en BD).
- POST /api/catalogo/importar
  - Importa datos al catálogo (guardar en BD).
- GET  /api/catalogo/stats
  - Devuelve estadísticas del catálogo (conteos, etc.).
- GET  /api/catalogo/buscar
  - Busca productos. Acepta parámetros de consulta (ej.: `?categoria=X`).

Ejemplos:

```bash
# Obtener scraping (resultado JSON)
curl http://localhost:3000/scrape

# Buscar productos
curl "http://localhost:3000/api/catalogo/buscar?categoria=electronica"
```

## Notas de desarrollo

- `db/init.js` inicializa la conexión a la base de datos antes de levantar el servidor; si la BD no está disponible la app se detendrá.
- Revisa `services/scrapeService.js` para ajustar selectores o la fuente de datos del scraping.

## Próximos pasos recomendados

- Añadir un archivo `.env` para gestionar credenciales y la URL de la base de datos.
- Añadir pruebas unitarias y scripts de `npm` para facilitar desarrollo.

Si quieres, puedo añadir ejemplos de `.env`, mejorar la documentación de los endpoints o crear un script `npm start`.

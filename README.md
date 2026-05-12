# Actividad 2.6 - Backend con Cheerio

## Objetivo
Procesar HTML en backend usando Node.js, Express y Cheerio para extraer información de una página web.

## Tecnologías
- Node.js
- Express
- Cheerio
- Axios

## Instalación

```bash
npm install
```

## Ejecución

```bash
npm start
```

Servidor:

http://localhost:3000

## Endpoint

### GET /scrape

Ejemplo:

```bash
http://localhost:3000/scrape?url=https://books.toscrape.com
```

```json
[
  {
    "titulo": "A Light in the Attic",
    "precio": "£51.77",
    "disponibilidad": "In stock"
  }
]
```

## Selectores usados
- `.product_pod`
- `h3 a`
- `.price_color`
- `.availability`

## Datos extraídos
- título
- precio
- disponibilidad
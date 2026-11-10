require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const db = require('./db');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/api/salud', (req, res) => {
  res.json({ mensaje: 'El servidor de la Plataforma de Referidos funciona' });
});

app.get('/', (req, res) => {
  res.send('API de la Plataforma de Referidos. Prueba /api/salud');
});

app.get('/api/db-test', async (req, res) => {
  try {
    const [filas] = await db.query('SELECT 1 + 1 AS resultado');
    res.json({ mensaje: 'Conexión a MySQL correcta', resultado: filas[0].resultado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al conectar con MySQL', detalle: error.message });
  }
});

app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
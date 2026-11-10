const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { verificarToken } = require('../middleware/auth');

const router = express.Router();

router.post('/registro', async (req, res) => {
  const { nombres, apellidos, identificacion, correo, telefono, contrasena, acepto_politica } = req.body;

  if (!nombres || !apellidos || !identificacion || !correo || !contrasena) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
  }

  if (!acepto_politica) {
    return res.status(400).json({ mensaje: 'Debes aceptar la política de privacidad' });
  }

  const contrasenaValida = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(contrasena);
  if (!contrasenaValida) {
    return res.status(400).json({ mensaje: 'La contraseña debe tener mínimo 8 caracteres, con letras y números' });
  }

  try {
    const [existentes] = await db.query(
      'SELECT id FROM usuarios WHERE correo = ? OR identificacion = ?',
      [correo, identificacion]
    );
    if (existentes.length > 0) {
      return res.status(409).json({ mensaje: 'El correo o la identificación ya están registrados' });
    }

    const hash = await bcrypt.hash(contrasena, 10);

    await db.query(
      `INSERT INTO usuarios
        (nombres, apellidos, identificacion, correo, telefono, contrasena_hash, acepto_politica)
       VALUES (?, ?, ?, ?, ?, ?, TRUE)`,
      [nombres, apellidos, identificacion, correo, telefono || null, hash]
    );

    res.status(201).json({
      mensaje: 'Registro exitoso. Tu cuenta está pendiente de verificación por la Cooperativa.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

router.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ mensaje: 'Ingresa tu correo y contraseña' });
  }

  try {
    const [filas] = await db.query(
      'SELECT id, nombres, rol, estado, contrasena_hash FROM usuarios WHERE correo = ?',
      [correo]
    );
    const usuario = filas[0];

    const contrasenaCorrecta = usuario && (await bcrypt.compare(contrasena, usuario.contrasena_hash));
    if (!contrasenaCorrecta) {
      return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
    }

    if (usuario.estado === 'pendiente') {
      return res.status(403).json({ mensaje: 'Tu cuenta está pendiente de verificación por la Cooperativa' });
    }
    if (usuario.estado === 'inactiva') {
      return res.status(403).json({ mensaje: 'Tu cuenta está inactiva. Contacta a la Cooperativa' });
    }

    const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET, {
      expiresIn: '30m',
    });

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 60 * 1000,
    });

    res.json({
      mensaje: 'Inicio de sesión correcto',
      usuario: { id: usuario.id, nombres: usuario.nombres, rol: usuario.rol },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ mensaje: 'Sesión cerrada' });
});

router.get('/yo', verificarToken, async (req, res) => {
  try {
    const [filas] = await db.query(
      'SELECT id, nombres, apellidos, correo, rol, estado FROM usuarios WHERE id = ?',
      [req.usuario.id]
    );
    if (filas.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json({ usuario: filas[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

module.exports = router;
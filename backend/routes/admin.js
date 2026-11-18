const express = require('express');
const db = require('../db');
const { verificarToken } = require('../middleware/auth');

const router = express.Router();

// Solo el administrador puede usar estas rutas (RNF02)
function soloAdmin(req, res, next) {
  if (req.usuario.rol !== 'administrador') {
    return res.status(403).json({ mensaje: 'No tienes permiso para esta acción' });
  }
  next();
}

router.use(verificarToken, soloAdmin);

// Lista de usuarios con quién los invitó
router.get('/usuarios', async (req, res) => {
  try {
    const [filas] = await db.query(
      `SELECT u.id, u.nombres, u.apellidos, u.identificacion, u.correo, u.telefono,
              u.producto_interes, u.rol, u.estado, u.codigo_referido, u.creado_en,
              CONCAT(i.nombres, ' ', i.apellidos) AS invitado_por
       FROM usuarios u
       LEFT JOIN usuarios i ON i.id = u.referido_por
       ORDER BY u.estado = 'pendiente' DESC, u.creado_en DESC`
    );
    res.json({ usuarios: filas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

// Cambiar el estado de una cuenta: activa o inactiva
router.patch('/usuarios/:id/estado', async (req, res) => {
  const { estado } = req.body;
  if (!['activa', 'inactiva'].includes(estado)) {
    return res.status(400).json({ mensaje: 'Estado no válido' });
  }
  if (Number(req.params.id) === req.usuario.id) {
    return res.status(400).json({ mensaje: 'No puedes cambiar el estado de tu propia cuenta' });
  }
  try {
    const [resultado] = await db.query('UPDATE usuarios SET estado = ? WHERE id = ?', [estado, req.params.id]);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json({ mensaje: estado === 'activa' ? 'Cuenta activada' : 'Cuenta desactivada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

module.exports = router;
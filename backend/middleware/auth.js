const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ mensaje: 'Debes iniciar sesión' });
  }
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Sesión expirada. Inicia sesión de nuevo' });
  }
}

function soloRol(...rolesPermitidos) {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ mensaje: 'Acceso denegado' });
    }
    next();
  };
}

module.exports = { verificarToken, soloRol };
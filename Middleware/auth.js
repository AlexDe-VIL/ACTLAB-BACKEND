const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No autorizado' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload.user;
    next();
  } catch {
    res.status(401).json({ msg: 'Token inválido' });
  }
};

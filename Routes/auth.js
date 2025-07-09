const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const auth = require('../Middleware/auth');

// ― Registro
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  let user = await User.findOne({ email });
  if (user) return res.status(400).json({ msg: 'Email ya existe' });
  user = new User({ name, email, password: await bcrypt.hash(password,10) });
  await user.save();
  const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '2h' });
  res.json({ token });
});

// ― Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(400).json({ msg: 'Credenciales inválidas' });
  const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '2h' });
  res.json({ token, role: user.role, name: user.name });
});

// ― Datos de perfil
router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

// ― Actualizar datos / contraseña
router.put('/me', auth, async (req, res) => {
  const updates = {};
  if (req.body.name) updates.name = req.body.name;
  if (req.body.password) updates.password = await bcrypt.hash(req.body.password,10);
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
  res.json(user);
});

module.exports = router;

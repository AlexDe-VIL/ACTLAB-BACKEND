const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const Appointment = require('../Models/Appointment');
const auth = require('../Middleware/auth');

// Middleware para verificar admin
function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Sin permiso' });
  next();
}

// CRUD Usuarios
router.get('/users', auth, isAdmin, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

router.post('/users', auth, isAdmin, async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ msg: 'Email ya existe' });
  const user = new User({ name, email, password, role });
  await user.save();
  res.json(user);
});

router.put('/users/:id', auth, isAdmin, async (req, res) => {
  const updates = req.body;
  if (updates.password) delete updates.password; // No permitir cambio directo de password aquí
  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
  res.json(user);
});

router.delete('/users/:id', auth, isAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Usuario eliminado' });
});

// CRUD Citas
router.get('/appointments', auth, isAdmin, async (req, res) => {
  const appts = await Appointment.find().populate('user','name email');
  res.json(appts);
});

router.post('/appointments', auth, isAdmin, async (req, res) => {
  const { user, date, status } = req.body;
  const appt = new Appointment({ user, date, status });
  await appt.save();
  res.json(appt);
});

router.put('/appointments/:id', auth, isAdmin, async (req, res) => {
  const appt = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(appt);
});

router.delete('/appointments/:id', auth, isAdmin, async (req, res) => {
  await Appointment.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Cita eliminada' });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Appointment = require('../Models/Appointment');
const auth = require('../Middleware/auth');

// ― Solicitar cita
router.post('/', auth, async (req, res) => {
  const { date } = req.body;
  const appt = new Appointment({ user: req.user.id, date });
  await appt.save();
  res.json(appt);
});

// ― Ver mis citas
router.get('/', auth, async (req, res) => {
  const list = await Appointment.find({ user: req.user.id });
  res.json(list);
});

// ― Admin: ver todas
router.get('/all', auth, async (req, res) => {
  if (req.user.role!=='admin') return res.status(403).json({ msg: 'Sin permiso' });
  const all = await Appointment.find().populate('user','name email');
  res.json(all);
});

// ― Cambiar estado (confirmar/cancelar)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role!=='admin') return res.status(403).json({ msg: 'Sin permiso' });
  const appt = await Appointment.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(appt);
});

module.exports = router;

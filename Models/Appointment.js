const { Schema, model } = require('mongoose');
const AppointmentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['pending','confirmed','cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = model('Appointment', AppointmentSchema);

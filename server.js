const path = require('path');
const express = require('express');

const cors = require('cors');
const app = express();



// Permitir peticiones CORS (por ejemplo, desde Postman o cualquier origen)
app.use(cors());

// Permitir que Express entienda cuerpos JSON
app.use(express.json());

// 1️⃣ Servir archivos estáticos desde la carpeta FRONTEND (hermana de BACKEND)
app.use(
  express.static(
    path.join(__dirname, '..', 'FRONTEND')
  )
);

// 2️⃣ Cuando alguien pida ‘/’, envía el index.html correcto
app.get('/', (req, res) => {
  res.sendFile(
    path.join(__dirname, '..', 'FRONTEND', 'index.html')
  );
});

// 3️⃣ Rutas de API para autenticación y citas
app.use('/api/auth', require('./Routes/auth'));
app.use('/api/appointments', require('./Routes/Appointment'));

// Configurar el puerto en el que correrá el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:5000`);
});

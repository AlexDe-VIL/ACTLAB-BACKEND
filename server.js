const path = require('path');
const express = require('express');
const app = express();
// … tu connectDB(), middlewares de JSON y CORS …

// 1️⃣ Sirve archivos estáticos desde la carpeta FRONTEND (hermana de BACKEND)
app.use(
  express.static(
    path.join(__dirname, '..', 'FRONTEND')
  )
);

// 2️⃣ Cuando alguien pida ‘/’, envía el index.html correcto
app.get('/', (req, res) => {
  res.sendFile(
    path.join(__dirname, '..', 'FRONTEND', 'Index.html')
  );
});

// 3️⃣ Tus rutas API siguen igual
app.use('/api/auth', require('./Routes/auth'));
app.use('/api/appointments', require('./Routes/Appointment'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Servidor corriendo en http://localhost:5000`)
);

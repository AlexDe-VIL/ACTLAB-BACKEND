import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';


const __dirname = path.dirname(fileURLToPath(import.meta.url));

import {methods as authentication} from './controllers/authentication.controller.js'


// Servidor
const app = express();
app.set('port', 4000);
app.listen(app.get('port'));
console.log("Servidor corriendo en puerto",app.get('port'));


// Configuracion
app.use(express.json());
app.use(express.static(__dirname + '/public'));


// Rutas
app.get('/', (req, res) => res.sendFile(__dirname + '/pages/login.html'))
app.get('/register', (req, res) => res.sendFile(__dirname + '/pages/register.html'))
app.get('/password', (req, res) => res.sendFile(__dirname + '/pages/password.html'))
app.get('/admin', (req, res) => res.sendFile(__dirname + '/pages/login_exitoso/admin.html'))


app.post('/api/register', authentication.register);
app.post('/api/login', authentication.login);
app.post('/api/password', authentication.password);
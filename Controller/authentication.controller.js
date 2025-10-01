const User = require('../Models/User'); // Asegúrate de que este modelo exista
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Función de registro
exports.register = async (req, res) => {
    const { username, password } = req.body;

    // Verificar si el usuario ya existe
    const userExist = await User.findOne({ username });
    if (userExist) {
        return res.status(400).json({ message: "Usuario ya existe" });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario
    const newUser = new User({
        username,
        password: hashedPassword
    });

    try {
        await newUser.save();
        res.status(201).json({ message: "Usuario creado con éxito" });
    } catch (err) {
        res.status(500).json({ message: "Error al crear usuario" });
    }
};

// Función de login
exports.login = async (req, res) => {
    const { username, password } = req.body;

    // Buscar el usuario
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // Verificar la contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // Generar un token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: "Inicio de sesión exitoso", token });
};

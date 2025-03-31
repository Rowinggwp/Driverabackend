const bcryptjs = require('bcryptjs');
const User = require('../models/user');

const registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Verificar si el correo ya existe
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'El correo ya está registrado' });
        }

        // Crear el usuario con rol de administrador
        user = new User({ name, email, password, role: 'ADMIN_ROLE' });

        // Encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync(password, salt);

        // Guardar en la BD
        await user.save();

        res.json({ msg: 'Administrador registrado con éxito', user });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

module.exports = { registerAdmin };

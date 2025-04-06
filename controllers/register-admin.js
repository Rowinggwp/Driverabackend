const bcryptjs = require('bcryptjs');
const User = require('../models/user');

const registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Verificar si el correo ya existe
        const userExist = await User.findOne({ 
            where: { email } 
        });
        
        if (userExist) {
            return res.status(400).json({ msg: 'El correo ya está registrado' });
        }

        // Encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        const hashedPassword = bcryptjs.hashSync(password, salt);

        // Crear el usuario con rol de administrador
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'ADMIN_ROLE'
        });

        // Eliminar password de la respuesta
        const { password: _, ...userData } = user.get({ plain: true });

        res.status(201).json({ 
            msg: 'Administrador registrado con éxito',
            user: userData
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

module.exports = { registerAdmin };

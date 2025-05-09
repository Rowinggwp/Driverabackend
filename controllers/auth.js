const { response, request } = require('express');
const User = require('../models/user');
const bcryptjs = require("bcryptjs");
const { generateJWT } =require('../helpers/generate-jwt');

const postLogin = async (req, res = response) => {
    const { email, password } = req.body;

    try {
        // Verificar si el email existe
        const user = await User.findOne({
            where: { email },
            attributes: ['id', 'password', 'state', 'name', 'email', 'roleId'] // Selecciona los campos necesarios
        });

        if (!user) {
            return res.status(400).json({
                msg: 'Usuario o Contraseña no son correctos - Correo'
            });
        }

        // Si el usuario no está activo
        if (!user.state) {
            return res.status(400).json({
                msg: 'Usuario o Contraseña no son correctos - Estado'
            });
        }

        // Verificar la contraseña
        const validatePassword = bcryptjs.compareSync(password, user.password);
        if (!validatePassword) {
            return res.status(400).json({
                msg: 'Usuario o Contraseña no son correctos - Password'
            });
        }

        // Generar el JWT
        const token = await generateJWT(user.id);

        // Eliminar password de la respuesta
        const { password: _, ...userData } = user.get({ plain: true });

        res.json({
            user: userData,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
};


module.exports = {postLogin};
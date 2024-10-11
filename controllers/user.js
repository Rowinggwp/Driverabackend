const { response, request } = require('express');
const User = require('../models/user');

// Obtener usuarios - paginado
const getUsers = async (req, res = response) => {
    const { limit = 25, desde = 0 } = req.query;
    const query = { state: true };

    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query).skip(Number(desde)).limit(Number(limit))
    ]);

    res.json({
        total,
        users
    });
};

// Crear usuario
const createUser = async (req, res = response) => {
    const { name, email, password, role } = req.body;
    
    const user = new User({ name, email, password, role });
    await user.save();

    res.status(201).json(user);
};

// Actualizar usuario
const updateUser = async (req = request, res = response) => {
    const { id } = req.params;
    const { state, password, ...data } = req.body;

    if (password) {
        // Aquí puedes hashear la contraseña si es necesario
    }

    const user = await User.findByIdAndUpdate(id, data, { new: true });

    res.json(user);
};

// Eliminar usuario
const deleteUser = async (req = request, res = response) => {
    const { id } = req.params;

    // Opción 1: Eliminar físicamente
    // const user = await User.findByIdAndDelete(id);

    // Opción 2: Cambiar el estado
    const user = await User.findByIdAndUpdate(id, { state: false }, { new: true });

    res.json(user);
};

// Obtener usuario por ID
const getUserById = async (req, res = response) => {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user || !user.state) {
        return res.status(404).json({
            msg: 'Usuario no encontrado'
        });
    }

    res.json(user);
};

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById
};

const { response, request } = require('express');
const User = require('../models/user');
const bcryptjs = require("bcryptjs");
const Role = require('../models/role');

// Obtener usuarios - paginado
const getUsers = async (req, res) => {
    const { limit = 25, desde = 0 } = req.query;
    
    try {
      const { count, rows: users } = await User.findAndCountAll({
        where: { state: true },
        offset: Number(desde),
        limit: Number(limit),
        order: [['createdAt', 'ASC']] // Opcional: ordenar por fecha de creación
      });
  
      res.json({
        total: count,
        users
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error al obtener usuarios' });
    }
  };
  

  const getUserByToken = async (req, res) => {
    const user = req.usuario;

    if (!user || !user.state) {
        return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    
    // Excluir contraseña en la respuesta
    const { password, ...userData } = user.get({ plain: true });
    res.json(userData);
};

const createUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    
    try {
        // 1. Buscar el rol por nombre (o usar USER_ROLE por defecto)
        const roleName = role || 'USER_ROLE';
        const rol = await Role.findOne({ where: { role: roleName } });
        
        if (!rol) {
            return res.status(400).json({
                msg: `El rol ${roleName} no existe`
            });
        }

        // 2. Encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        const hashedPassword = bcryptjs.hashSync(password, salt);

        // 3. Crear usuario con el ID del rol
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            roleId: rol.id
        });

        // 4. Obtener el usuario recién creado con el nombre del rol
        const userWithRole = await User.findByPk(user.id, {
            include: {
                model: Role,
                attributes: ['role'],
                as: 'roleInfo'
            },
            attributes: { exclude: ['password', 'roleId'] }
        });

        // 5. Formatear respuesta
        const responseUser = {
            ...userWithRole.toJSON(),
            role: userWithRole.roleInfo.role
        };
        delete responseUser.roleInfo;

        res.status(201).json(responseUser);

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            msg: 'Error al crear usuario',
            error: error.message 
        });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { password, ...data } = req.body;

    try {
        const user = await User.findByPk(id);
        
        if (!user || !user.state) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        if (password) {
            const salt = bcryptjs.genSaltSync();
            user.password = bcryptjs.hashSync(password, salt);
        }

        await user.update(data);
        
        const { password: _, ...userData } = user.get({ plain: true });
        res.json(userData);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar usuario' });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);
        
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        await user.update({ state: false });
        
        res.json({ msg: 'Usuario desactivado correctamente' });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al eliminar usuario' });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });
        
        if (!user || !user.state) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        res.json(user);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener usuario' });
    }
};

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    getUserByToken,
};

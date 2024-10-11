const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const validateJWT = async (req = request, res = response, next) => {
    
    const token = req.header('x-token');
    if( !token ){
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        })
    }

    try {

        const { uid } = jwt.verify ( token , process.env.SECRETORPRIVETEKEY)
        // recuperar datos del usuario autenticado
        const usuarioAuth = await User.findById( uid );
        
        if ( !usuarioAuth ){
            return res.status(401).json({
                msg: 'Token no valido - Usuario no existe en la BD'
            })
        }
        
        if ( !usuarioAuth.state ){
            return res.status(401).json({
                msg: 'Token no valido - Usuario no activo'
            })
        }
        
        req.usuario = usuarioAuth;

        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: 'Token no válido'
        })
        
    }
     

}

module.exports = {
    validateJWT
}
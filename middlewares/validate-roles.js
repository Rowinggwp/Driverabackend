const { response } = require("express")


const isAdminRole = ( req, res = response, next ) => {

    if( !req.usuario ){
        return res.status(500).json({
            msg: 'Se requiere verificar el role sin validar el token primero'
        });
    }

    const { role, name } = req.usuario;
    if (role !== 'ADMIN_ROLE') { 
        return res.status(401).json({
            msg:  `${ name } no es un administrador - no puedes hacer esto`
        });
    }
    next();
}

const isThisRoles = ( ...roles ) => {
    return ( req, res = response, next ) => {

        if( !req.usuario ){
            return res.status(500).json({
                qmsg: 'Se requiere verificar el role sin validar el token primero'
            });
        }

        if( !roles.includes ( req.usuario.role ) ){
            return res.status(500).json({
                msg: `El servicio requiere uno de estos roles ${roles}`
            });
        }

        next();

    }
}



module.exports = {
    isAdminRole,
    isThisRoles
}
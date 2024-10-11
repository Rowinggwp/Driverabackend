const { response, request } = require('express');
const User = require('../models/user');
const bcryptjs = require("bcryptjs");
const { generateJWT } =require('../helpers/generate-jwt');

const postLogin = async(req, res = response) =>{
    const { email, password } = req.body;

    try {

        //verificar si el email existe
        const user = await User.findOne({ email });
    
        if ( !user ) {
            return res.status(400).json({
                msg: 'Usuario o Contraseña no son correctos - Correo'
            });
        }
        
        // sie el usuario no está activo
        if ( !user.state ) {
            return res.status(400).json({
                msg: 'Usuario o Contraseña no son correctos - Estado'
            });
        }
    
        //verificar la contraseña
    
        const validatePassword = bcryptjs.compareSync(password, user.password);
        if ( !validatePassword ) {
            return res.status(400).json({
                msg: 'Usuario o Contraseña no son correctos - Password'
            });
        }
    
        //generar el JWT
        
        const token = await generateJWT( user.id );
        
        
        res.json ({
            user,
            token
        })
        
      } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
      }
      
       


}


module.exports = {postLogin};
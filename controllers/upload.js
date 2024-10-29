const path = require('path'); 
const fs = require('fs');
const { response } = require("express");
const User = require('../models/user');
const Product = require('../models/product');
const { uploadsFiles } = require('../helpers/upload-files');


const uploadFiles = async (req, res= response) => {

    try {
        //const nameFile = await uploadsFiles(req.files, ['txt', 'md'], 'textos');
        const nameFile = await uploadsFiles(req.files, undefined, 'imgs');

        res.json({
           nameFile
        });
        
    } catch (msg) {
        res.status(400).json({ msg });        
    }
   
}


const updateImgs = async ( req, res= response ) => {

    const { id, colletion } = req.params;

    let model;

    try {

        switch ( colletion ) {
            case 'users':
                model = await User.findById ( id );
                if ( !model ){
                    return res.status(400).json ({
                        msg: `No existe un usuario con el Id ${ id }`
                    });
                }
                break;
    
            case 'products':
                model = await Product.findById ( id );
                if ( !model ){
                    return res.status(400).json ({
                        msg: `No existe un producto con el Id ${ id }`
                    });
                }
                model.user = req.usuario._id;
                
            break;
        
            default:
                return res.status(500).json ({ msg: 'Se me olvido validar eso'});
            
        }

        // limpiar imagen previas
        if ( model.images ) {
            // borrar la imagen del servidor
            const pathImage = path.join( __dirname, '../uploads', colletion, model.images );
            //validar si existe en archivo del filesystem
            if (fs.existsSync( pathImage )){
                fs.unlinkSync( pathImage );   // elimina el archivo de la ruta             
            }
        }
       
        

        // subir Archivo
        const nameFile = await uploadsFiles ( req.files, undefined, colletion, model._id );
        model.images = nameFile;    
    
        await model.save();
    
        res.json({
            model
        })
        
    } catch (msg) {
        res.status(400).json({ msg }); 
    }
   
}


const showImage = async ( req , res= response ) => {
    
    const { id, colletion } = req.params;
    
    let model;

    try {

        switch ( colletion ) {
            case 'users':
                model = await User.findById ( id );
                if ( !model ){
                    return res.status(400).json ({
                        msg: `No existe un usuario con el Id ${ id }`
                    });
                }
                break;
    
            case 'products':
                model = await Product.findById ( id );
                if ( !model ){
                    return res.status(400).json ({
                        msg: `No existe un producto con el Id ${ id }`
                    });
                }
               
                
            break;
        
            default:
                return res.status(500).json ({ msg: 'Se me olvido validar eso'});
            
        }

        // limpiar imagen previas
        if ( model.images ) {
            // borrar la imagen del servidor

           
            const pathImage = path.join( __dirname, '../uploads', colletion, model.images );
              //validar si existe en archivo del filesystem
            if (fs.existsSync( pathImage )){
                console.log(pathImage)
                return res.sendFile( pathImage );   // elimina el archivo de la ruta             
            }           
            
        }
        
        //cargar imagen por default
        const pathImage = path.join( __dirname, '../assets/no-image.jpg' );
            //validar si existe en archivo del filesystem
        if (fs.existsSync( pathImage )){
            return res.sendFile( pathImage );   // elimina el archivo de la ruta             
        }else{
            res.json({
                msg: 'Falta Placeholder'
            });
        }

       
        
    } catch (msg) {
        console.log(msg);        
        res.status(400).json({ msg }); 
    }
   
}

module.exports = {
    uploadFiles,
    updateImgs,
    showImage,
}
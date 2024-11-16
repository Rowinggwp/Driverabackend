const { response } = require("express");



const validateFilesUpload =  ( req, res = response, next ) => {
      
    // console.log(req.files)
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.uploadFile)  {
        return res.status(400).json({
            msg: 'No hay archivos que subir'
        });        
    }    

    next();
}

module.exports = {
    validateFilesUpload
}
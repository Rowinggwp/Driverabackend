const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadsFiles = ( files , validextensions = ['png', 'jpg', 'jpeg', 'gif'], folder = '', nameFile) => {
    

    return new Promise ( ( resolve, reject ) => {
       
        const { uploadFile } = files;
        const nameFileSplit = uploadFile.name.split('.');
        const extension = nameFileSplit[ nameFileSplit.length - 1];

        // validar extension
        if ( !validextensions.includes(extension) ){
            return reject(`La extension ${extension}  no es permitida, solo se permiten ${validextensions}`);  
        } 
    
       // const nameTemp =  uuidv4() + '.' + extension; 
       const nameTemp =  nameFile + '.' + extension; 

        const uploadPath = path.join(__dirname , '../uploads/', folder, nameTemp );

        uploadFile.mv(uploadPath, (err) => {
            if (err) {
                console.log(err);
                reject(err);
            }

            resolve( nameTemp );

        });

    });

      

}

module.exports = {
    uploadsFiles
}
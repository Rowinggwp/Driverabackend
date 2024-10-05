const mongoose = require('mongoose');


const dbConnection = async () => {

    try {

        await mongoose.connect(process.env.MONGODB_CNN);


        console.log('Base de Datos Online');
        
        
    } catch (error) {
        console.log(error);
        throw new('Error a la hora de iniciar la DB')
    }
}

module.exports = {
    dbConnection
}
  
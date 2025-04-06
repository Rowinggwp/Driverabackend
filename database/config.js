//const mysql = require('mysql');

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize( 
    process.env.DB_MYSQL, 
    process.env.USER_MYSQL, 
    process.env.PASSWORD_MYSQL,
    {
  host: process.env.HOST_MYSQL,
  dialect: 'mysql',
  logging: false, // Desactiva los logs de SQL si quieres
});

const dbConnection = async () => {
    try {
      // Autenticación y conexión a la DB
      await sequelize.authenticate();
      
      // Sincronizar modelos con la DB (opcional, para desarrollo)
      await sequelize.sync(); // ¡No usar { force: true } en producción!
      
      console.log('Base de Datos Online');
    } catch (error) {
      console.error(error);
      throw new Error('Error a la hora de iniciar la DB'); // Corregí el error de sintaxis aquí
    }
  };
  
  module.exports = {
    dbConnection,
    sequelize // Exportamos la instancia por si necesitas usarla directamente
  };


//const dbConnection =  () => {
//
//    try {
//        const con = mysql.createConnection({
//            host: process.env.HOST_MYSQL,
//            user: process.env.USER_MYSQL,
//            password: process.env.PASSWORD_MYSQL,
//            database: "drivera"
//          });
//          
//      return con; 
//
//        console.log('Base de Datos Online');
//        
//        
//    } catch (error) {
//        console.log(error);
//        throw new('Error a la hora de iniciar la DB')
//    }
//}

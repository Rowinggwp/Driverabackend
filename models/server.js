const express = require('express');
const cors = require('cors');


const {  dbConnection }  = require('../database/config');
const buy = require('./buy');



class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        //routes
        this.paths = {
            products:       '/api/product',
            auth:           '/auth',
            buy:            '/api/user'                                               
        }
       
        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();   
           

        // Rutas de mi aplicación
        this.routes();
    }


    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use ( express.json() );
       
    }

    routes(){

        this.app.use(this.paths.products , require('../routes/product'));
        

    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en  puerto', this.port);
        })
    }
}

module.exports = Server;


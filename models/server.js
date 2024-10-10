const express = require('express');
const cors = require('cors');


const {  dbConnection }  = require('../database/config');
const buy = require('./buy');



class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        // Rutas
        this.paths = {
            products: '/api/product',
            auth: '/auth',
            buy: '/api/buy' // Cambié la ruta para la API de buy
        };
       
        // Conectar a la base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();   

        // Rutas de mi aplicación
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());
    }

    routes() {
        this.app.use(this.paths.products, require('../routes/product'));
        this.app.use(this.paths.buy, require('../routes/buy')); //ruta para buy
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }
}

module.exports = Server;



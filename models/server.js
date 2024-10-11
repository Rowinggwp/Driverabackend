const express = require('express');
const cors = require('cors');

const { dbConnection } = require('../database/config');
const buy = require('./buy');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 8080;

        // Rutas
        this.paths = {
            products: '/api/product',
            auth: '/api/auth',
            buy: '/api/buy', // Ruta para la API de Buy
            categories: '/api/categories', // Nueva ruta para la API de Category
            user: '/api/user',
            client: '/api/client'



        };
       
        this.conectarDB();

        this.middlewares();   

       
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        
        this.app.use(cors());

        this.app.use(express.json());
    }

    routes() {
        this.app.use(this.paths.products, require('../routes/product')); 
        this.app.use(this.paths.buy, require('../routes/buy')); 
        this.app.use(this.paths.categories, require('../routes/category')); 
        this.app.use(this.paths.user, require('../routes/user')); 
        this.app.use(this.paths.client, require('../routes/client')); 
        this.app.use(this.paths.auth, require('../routes/auth')); 

    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }
}

module.exports = Server;

const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload'); // Importamos express-fileupload
const path = require('path'); // Importar path para servir archivos estáticos
const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 8080;

        // Definir las rutas de la API
        this.paths = {
            products: '/api/product',
            auth: '/api/auth',
            buy: '/api/buy',          // Ruta para la API de Buy (Compras)
            categories: '/api/categories',  // Ruta para la API de Category
            user: '/api/user',
            client: '/api/client',
            uploads: '/api/uploads', // Ruta para la API de subida de archivos
        };
       
        // Conectar a la base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();   

        // Rutas de la aplicación
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        // Configurar CORS para permitir solicitudes desde otros dominios
        this.app.use(cors());

        // Lectura y parseo del body para recibir datos en JSON
        this.app.use(express.json());

        // Middleware para manejo de subida de archivos con express-fileupload
        this.app.use(fileUpload({
            useTempFiles: true,     // Almacena archivos en un directorio temporal
            tempFileDir: '/tmp/',   // Directorio temporal para almacenar archivos
            createParentPath: true  // Crea directorios padres si no existen
        }));

        // Servir archivos estáticos desde la carpeta uploads
        this.app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

        // Servir directorio público, opcional si manejas archivos estáticos
        this.app.use(express.static('public'));
        this.app.use(express.static('uploads'));
    }

    routes() {
        // Definir las rutas de la aplicación para diferentes recursos
        this.app.use(this.paths.products, require('../routes/product'));   // Productos
        this.app.use(this.paths.buy, require('../routes/buy'));            // Compras
        this.app.use(this.paths.categories, require('../routes/category')); // Categorías
        this.app.use(this.paths.user, require('../routes/user'));          // Usuarios
        this.app.use(this.paths.client, require('../routes/client'));      // Clientes
        this.app.use(this.paths.auth, require('../routes/auth'));          // Autenticación
        this.app.use(this.paths.uploads, require('../routes/upload'));     // Subida de archivos
    }

    listen() {
        // Iniciar el servidor en el puerto definido
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }
}

module.exports = Server;

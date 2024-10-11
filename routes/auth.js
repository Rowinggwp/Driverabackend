const { Router } = require('express');
const { postLogin } = require('../controllers/auth'); // Importar los controladores

const router = Router();
    router.post('/login', postLogin);

module.exports = router;
const { Router } = require ('express');

const { getProducts, createProduct } = require('../controllers/buy');

const { Router } = require('express');
const { getBuys, createBuy } = require('../controllers/buy');

const router = Router();

// Obtener compras
router.get('/', getBuys);

// Crear compra
router.post('/', createBuy);

module.exports = router;

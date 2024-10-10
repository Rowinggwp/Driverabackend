const { Router } = require('express');
const {
    getBuys,
    getBuyById,
    createBuy,
    updateBuy,
    deleteBuy
} = require('../controllers/buy'); // Importar los controladores

const router = Router();

// Obtener todas las compras
router.get('/', getBuys);

// Obtener una compra por ID
router.get('/:id', getBuyById);

// Crear una compra
router.post('/', createBuy);

// Actualizar una compra por ID
router.put('/:id', updateBuy);

// Eliminar (desactivar) una compra por ID
router.delete('/:id', deleteBuy);

module.exports = router;

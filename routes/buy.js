const { Router } = require('express');
const { getBuys,  getBuyById, createBuy,  updateBuy,  deleteBuy
} = require('../controllers/buy'); // Importar los controladores

const router = Router();
    router.get('/', getBuys);
    router.get('/:id', getBuyById);
    router.post('/', createBuy);
    router.put('/:id', updateBuy);
    router.delete('/:id', deleteBuy);

module.exports = router;

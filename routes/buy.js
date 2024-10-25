const { Router } = require("express");
const { check } = require("express-validator");
const { buyProduct, getBuyHistory, getBuys, getBuyById, createBuy, updateBuy, deleteBuy, getBuyByUser, getBuyByClient } = require("../controllers/buy");
const { validateFields } = require("../middlewares/validate-fields");
const { existBuyById, existClientById, validateProducts } = require("../helpers/db-validators");
const { validateJWT } = require("../middlewares/validate-jwt");

const router = Router();


// Otras rutas existentes
router.get('/', getBuys);

router.get('/byuser/:id', getBuyByUser);

router.get('/byclient/:id', getBuyByClient);

router.get('/:id', [
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(existBuyById),
    validateFields
], getBuyById);

router.post('/',[
    validateJWT,
    check ('total','El total es obligatorio').notEmpty(),
    check ('client','No es un id valido ').isMongoId(),
    check ('client').custom(existClientById),
    check ('products').custom(validateProducts),
    validateFields
], createBuy);

router.put('/:id', [
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(existBuyById),
    validateFields
], updateBuy);

router.delete('/:id', [
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(existBuyById),
    validateFields
], deleteBuy);

// Historial de compras
router.get("/historial/:userId", getBuyHistory);

module.exports = router;

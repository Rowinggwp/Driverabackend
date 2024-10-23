const { Router } = require("express");
const { check } = require("express-validator");
const { buyProduct, getBuyHistory, getBuys, getBuyById, createBuy, updateBuy, deleteBuy } = require("../controllers/buy");
const { validateFields } = require("../middlewares/validate-fields");
const { existBuyById, existClientById, validateProducts } = require("../helpers/db-validators");
const { validateJWT } = require("../middlewares/validate-jwt");

const router = Router();

// Ruta para comprar un producto
router.post("/comprar", [
    check('userId', 'El ID del usuario es obligatorio').isMongoId(),
    check('productId', 'El ID del producto es obligatorio').isMongoId(),
    check('quantity', 'La cantidad debe ser un número mayor que 0').isInt({ min: 1 }),
    validateFields
], buyProduct);

// Otras rutas existentes
router.get('/', getBuys);

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

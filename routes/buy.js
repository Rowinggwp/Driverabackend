const { Router } = require("express");
const { check } = require("express-validator");
const { getBuyHistory, getBuys, getBuyById, createBuy, updateBuy, deleteBuy, getBuyByUser, getBuyByClient } = require("../controllers/buy");
const { validateFields } = require("../middlewares/validate-fields");
const { existBuyById, existClientById, validateProducts } = require("../helpers/db-validators");
const { validateJWT } = require("../middlewares/validate-jwt");
const { isAdminRole, } = require("../middlewares/validate-roles"); // Importa el validador de roles

const router = Router();

router.get('/', getBuys);

router.get('/byuser/:id', getBuyByUser);

router.get('/byclient/:id', getBuyByClient);

router.get('/:id', [
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(existBuyById),
    validateFields
], getBuyById);

router.post('/', [
    validateJWT, 
    check('total', 'El total es obligatorio y debe ser un número positivo').isFloat({ gt: 0 }),
    check('client', 'No es un id valido ').isMongoId(),
    check('client').custom(existClientById),
    check('products', 'Los productos son obligatorios').isArray({ min: 1 }),
    check('products.*.id', 'El ID del producto no es válido').isMongoId(),
    check('products.*.quantity', 'La cantidad debe ser un número entero positivo').isInt({ gt: 0 }),
    check('products').custom(validateProducts),
    validateFields
], createBuy);

router.put('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(existBuyById),
    validateFields
], updateBuy);

router.delete('/:id', [
    validateJWT,
    isAdminRole, 
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(existBuyById),
    validateFields
], deleteBuy);

router.get("/historial/:userId", getBuyHistory);

module.exports = router;

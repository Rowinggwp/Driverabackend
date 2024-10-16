const { Router } = require('express');
const { check } = require('express-validator');
const { getProducts, createProduct, getProductByID, deleteProduct, updateProduct } = require('../controllers/product');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');
const { existProductById } = require('../helpers/db-validators');

const router = Router();

router.get('/', getProducts);

router.get('/:id', [
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(existProductById),
    validateFields
], getProductByID);

router.post('/', [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validateFields
], createProduct);

router.put('/:id', [
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(existProductById),
    validateFields
], updateProduct);

router.delete('/:id', [
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(existProductById),
    validateFields
], deleteProduct);

module.exports = router;

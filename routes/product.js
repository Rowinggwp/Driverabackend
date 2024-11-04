const { Router } = require('express');
const { check } = require('express-validator');
const { getProducts, createProduct, getProductByID, deleteProduct, updateProduct, getProductByCategory } = require('../controllers/product');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');
const { existProductById } = require('../helpers/db-validators');
const { validateFilesUpload } = require('../middlewares/validate-files-upload');
const { isAdminRole } = require('../middlewares/validate-roles'); 

const router = Router();

router.get('/', getProducts);

router.get('/category/:id', getProductByCategory);

router.get('/:id', [
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(existProductById),
    validateFields
], getProductByID);

router.post('/', [
    validateJWT,
    isAdminRole, 
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validateFilesUpload,
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

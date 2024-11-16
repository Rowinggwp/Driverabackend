const { Router } = require('express');
const { check } = require('express-validator');
const { getProducts, createProduct, getProductByID, deleteProduct, updateProduct, getProductByCategory } = require('../controllers/product');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');
const { existProductById, existCategoryById } = require('../helpers/db-validators');
const { validateFilesUpload } = require('../middlewares/validate-files-upload');
const { isAdminRole } = require('../middlewares/validate-roles');

const router = Router();

router.get('/', getProducts);

router.get('/category/:id', [
    check('id', 'El ID de la categoría no es válido').isMongoId(),
    check('id').custom(existCategoryById), 
    validateFields
], getProductByCategory);

router.get('/:id', [
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(existProductById),
    validateFields
], getProductByID);

router.post('/', [
    validateJWT,  
    isAdminRole,  
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('price', 'El precio debe ser un número válido').isNumeric(),
    check('price').custom(value => {
        if (value < 0) {
            throw new Error('El precio no puede ser negativo');
        }
        return true;
    }),
    // check('stock', 'El stock debe ser un número válido').isNumeric(),
   // check('stock').custom(value => {
      //  if (value < 0) {
       //     throw new Error('El stock no puede ser negativo');
       // }
      //  return true;
   // }),
    check('category', 'El ID de la categoría no es válido').isMongoId(),
    check('category').custom(existCategoryById), 
    validateFilesUpload,  
    validateFields
], createProduct);

router.put('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(existProductById), 
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('price', 'El precio debe ser un número válido').isNumeric(),
    check('price').custom(value => {
        if (value < 0) {
            throw new Error('El precio no puede ser negativo');
        }
        return true;
    }),
    // check('stock', 'El stock debe ser un número válido').isNumeric(),
   // check('stock').custom(value => {
      //  if (value < 0) {
       //     throw new Error('El stock no puede ser negativo');
       // }
      //  return true;
   // }),
    check('category', 'El ID de la categoría no es válido').isMongoId(),
    check('category').custom(existCategoryById), 
    validateFields
], updateProduct);

router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(existProductById),
    validateFields
], deleteProduct);

module.exports = router;

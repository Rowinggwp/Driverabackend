const { Router } = require('express');
const { check } = require('express-validator');
const { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } = require('../controllers/category');
const { validateFields } = require('../middlewares/validate-fields');
const { existCategoryById, categoryNameUnique } = require('../helpers/db-validators');
const { validateJWT } = require('../middlewares/validate-jwt');
const { isAdminRole } = require('../middlewares/validate-roles'); // Importa tus validadores de roles

const router = Router();

router.get('/', getCategories);

router.get('/:id', [
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(existCategoryById),
    validateFields
], getCategoryById);

router.post('/', [
    validateJWT,
    isAdminRole, 
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('name').custom(categoryNameUnique), 
    validateFields
], createCategory);

router.put('/:id', [
    validateJWT,
    isAdminRole, 
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(existCategoryById),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validateFields
], updateCategory);

router.delete('/:id', [
    validateJWT,
    isAdminRole, 
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(existCategoryById),
    validateFields
], deleteCategory);

module.exports = router;

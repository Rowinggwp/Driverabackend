const { Router } = require('express');
const { check } = require('express-validator');
const { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } = require('../controllers/category');
const { validateFields } = require('../middlewares/validate-fields');
const { existCategoryById } = require('../helpers/db-validators');

const router = Router();

router.get('/', getCategories);

router.get('/:id', [
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(existCategoryById),
    validateFields
], getCategoryById);

router.post('/', createCategory);

router.put('/:id', [
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(existCategoryById),
    validateFields
], updateCategory);

router.delete('/:id', [
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(existCategoryById),
    validateFields
], deleteCategory);

module.exports = router;

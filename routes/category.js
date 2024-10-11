const { Router } = require('express');
const { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } = require('../controllers/category');

const router = Router();
    router.get('/', getCategories);
    router.get('/:id', getCategoryById);
    router.post('/', createCategory);
    router.put('/:id', updateCategory);
    router.delete('/:id', deleteCategory);

module.exports = router;

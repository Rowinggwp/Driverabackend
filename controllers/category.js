const Category = require('../models/category');

// Obtener todas las categorías
const getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json({ categories });
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener categorías' });
    }
};

// Obtener una categoría por id
const getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ msg: 'Categoría no encontrada' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener categoría' });
    }
};

// Crear nueva categoría
const createCategory = async (req, res) => {
    const { name } = req.body;
    try {
        const category = await Category.create({ name });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear categoría' });
    }
};

// Actualizar categoría por id
const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ msg: 'Categoría no encontrada' });
        }
        
        await category.update({ name });
        res.json(category);
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar categoría' });
    }
};

// Eliminar categoría por id
const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ msg: 'Categoría no encontrada' });
        }
        
        await category.destroy();
        res.json({ msg: 'Categoría eliminada' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar categoría' });
    }
};

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};

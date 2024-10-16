const Buy = require('../models/buy');
const Client = require('../models/client');
const Category = require('../models/category');
const Product = require('../models/product');
const User = require('../models/user');

// Validar si el ID de Buy existe
const existBuyById = async (id) => {
    const buy = await Buy.findById(id);
    if (!buy) {
        throw new Error(`El ID ${id} de la compra no existe`);
    }
};

// Validar si el ID de Client existe
const existClientById = async (id) => {
    const client = await Client.findById(id);
    if (!client) {
        throw new Error(`El ID ${id} del cliente no existe`);
    }
};

// Validar si el ID de Category existe
const existCategoryById = async (id) => {
    const category = await Category.findById(id);
    if (!category) {
        throw new Error(`El ID ${id} de la categoría no existe`);
    }
};

// Validar si el ID de Product existe
const existProductById = async (id) => {
    const product = await Product.findById(id);
    if (!product) {
        throw new Error(`El ID ${id} del producto no existe`);
    }
};

// Validar si el ID de User existe
const existUserById = async (id) => {
    const user = await User.findById(id);
    if (!user) {
        throw new Error(`El ID ${id} del usuario no existe`);
    }
};

module.exports = {
    existBuyById,
    existClientById,
    existCategoryById,
    existProductById,
    existUserById
};

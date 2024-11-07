const Buy = require('../models/buy');
const Client = require('../models/client');
const Category = require('../models/category');
const Product = require('../models/product');
const User = require('../models/user');

// Validar si el nombre de la categoría es único
const categoryNameUnique = async (name = '') => {
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
        throw new Error(`La categoría con el nombre "${name}" ya existe`);
    }
};

// Validar si el email de un cliente es único
const isEmailUnique = async (email = '') => {
    const client = await Client.findOne({ email });
    if (client) {
        throw new Error(`El correo electrónico ${email} ya está registrado`);
    }
};

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

// Validar que los productos sean válidos y haya suficiente stock
const validateProducts = async (products) => {
    for (const item of products) {
        const product = await Product.findById(item.product);

        if (!product) {
            throw new Error(`El producto con el ID ${item.product} no existe`);
        }

        if (product.stock < item.quantity) {
            throw new Error(`Stock insuficiente para el producto ${product.name}`);
        }
    }
};

// Validar si la colección existe y es válida
const colletionExists = (collection = '', collections = []) => {
    const included = collections.includes(collection);

    if (!included) {
        throw new Error(`La colección ${collection} no es permitida, solo se permiten ${collections}`);
    }

    return true;
};

module.exports = {
    existBuyById,
    existClientById,
    existCategoryById,
    existProductById,
    existUserById,
    validateProducts,
    colletionExists,
    categoryNameUnique,
    isEmailUnique 
};

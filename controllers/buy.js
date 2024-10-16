const { response } = require("express");
const Buy = require("../models/buy");
const Product = require("../models/product");
const mongoose = require("mongoose");

// Obtener todas las compras - paginado - total
const getBuys = async (req, res = response) => {
    const { limit = 25, desde = 0 } = req.query;
    const query = { state: true };

    const [total, buys] = await Promise.all([
        Buy.countDocuments(query),
        Buy.find(query)
            .populate("user", "name") // Popular datos del usuario
            .populate("products.product", "name price") // Popular datos del producto
            .skip(Number(desde))
            .limit(Number(limit))
    ]);

    res.json({
        total,
        buys
    });
};

// Obtener una compra por ID
const getBuyById = async (req, res = response) => {
    const { id } = req.params;
    const buy = await Buy.findById(id)
        .populate("user", "name") // Popular datos del usuario
        .populate("products.product", "name price");

    if (!buy) {
        return res.status(404).json({
            msg: "Compra no encontrada"
        });
    }

    res.json(buy);
};

// Crear una nueva compra
const createBuy = async (req, res = response) => {
    const { user, products, ...data } = req.body;

    // Iniciar una sesión para manejar la transacción
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        for (const item of products) {
            const product = await Product.findById(item.product);

            if (!product) {
                throw new Error(`El producto con el ID ${item.product} no existe`);
            }

            // Verificar que haya suficiente stock
            if (product.stock < item.quantity) {
                throw new Error(`Stock insuficiente para el producto ${product.name}`);
            }

            // Descontar el stock
            product.stock -= item.quantity;
            await product.save({ session });
        }

        // Crear la nueva compra
        const buy = new Buy({
            ...data,
            user,
            products
        });

        // Guardar la compra en la base de datos
        await buy.save({ session });

        // Confirmar la transacción
        await session.commitTransaction();
        session.endSession();

        res.status(201).json(buy);
    } catch (error) {
        // Si algo falla, revertir los cambios
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
            msg: error.message
        });
    }
};

// Actualizar una compra
const updateBuy = async (req, res = response) => {
    const { id } = req.params;
    const { state, ...data } = req.body;

    const buy = await Buy.findByIdAndUpdate(id, data, { new: true });

    if (!buy) {
        return res.status(404).json({
            msg: "Compra no encontrada"
        });
    }

    res.json(buy);
};

// Eliminar una compra
const deleteBuy = async (req, res = response) => {
    const { id } = req.params;

    const buy = await Buy.findByIdAndUpdate(id, { state: false }, { new: true });

    if (!buy) {
        return res.status(404).json({
            msg: "Compra no encontrada"
        });
    }

    res.json(buy);
};

module.exports = {
    getBuys,
    getBuyById,
    createBuy,
    updateBuy,
    deleteBuy
};

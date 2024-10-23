const { response } = require("express");
const Buy = require("../models/buy");
const Product = require("../models/product");
const mongoose = require("mongoose");

// Función para comprar un producto
const buyProduct = async (req, res = response) => {
    const { userId, productId, quantity } = req.body;

    // Iniciar una sesión para manejar la transacción
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Buscar el producto por ID
        const product = await Product.findById(productId);

        if (!product) {
            throw new Error(`El producto con el ID ${productId} no existe`);
        }

        // Verificar si hay suficiente stock
        if (product.stock < quantity) {
            throw new Error(`Stock insuficiente para el producto ${product.name}`);
        }

        // Actualizar el stock
        product.stock -= quantity;
        await product.save({ session });

        // Crear una nueva compra para el usuario
        const buy = new Buy({
            user: userId,
            products: [{ product: productId, quantity }]
        });

        // Guardar la compra
        await buy.save({ session });

        // Confirmar la transacción
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            msg: 'Compra realizada con éxito',
            buy
        });
    } catch (error) {
        // Si algo falla, revertir los cambios
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({
            msg: error.message
        });
    }
};

// Obtener todas las compras - paginado - total
const getBuys = async (req, res = response) => {
    const { limit = 25, desde = 0 } = req.query;
    const query = { state: true };

    const [total, buys] = await Promise.all([
        Buy.countDocuments(query),
        Buy.find(query)
            .populate("user", "name")
            .populate("client", "dni name phone address")
            .populate("products.product", "name price description")
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
        .populate("user", "name")
        .populate("client", "dni name phone address")
        .populate("products.product", "name price description");

    if (!buy) {
        return res.status(404).json({
            msg: "Compra no encontrada"
        });
    }

    res.json(buy);
};

// Crear una nueva compra
const createBuy = async (req, res = response) => {
    const { products, ...data } = req.body;

    //const session = await mongoose.startSession();
   // session.startTransaction();

    try {
        for (const item of products) {
            const product = await Product.findById(item.product);

            product.stock -= item.quantity;
console.log(product.stock);

            await Product.findByIdAndUpdate(product._id, product, { new: true });

        }
        
        const buy = new Buy({
            ...data,
            user : req.usuario._id,
            products
        });

        await buy.save();
       const newbuy = await Buy.findById (buy._id)
       .populate("user", "name")
       .populate("client", "dni name phone address")
       .populate("products.product", "name description price ")

        res.status(201).json(newbuy);


    } catch (error) {
       // await session.abortTransaction();
       // session.endSession();
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

// Obtener historial de compras de un usuario
const getBuyHistory = async (req, res = response) => {
    const { userId } = req.params;

    const buys = await Buy.find({ user: userId })
        .populate('products.product', 'name price')
        .populate('user', 'name');

    if (!buys) {
        return res.status(404).json({
            msg: "No se encontraron compras para este usuario"
        });
    }

    res.json({
        totalCompras: buys.length,
        historial: buys
    });
};

module.exports = {
    buyProduct,
    getBuys,
    getBuyById,
    createBuy,
    updateBuy,
    deleteBuy,
    getBuyHistory // Añadido el historial de compras
};

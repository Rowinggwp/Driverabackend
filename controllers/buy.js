const { response } = require("express");
const Buy = require("../models/buy");



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
    const { state, user, ...data} = req.body;

    // // Crear una nueva compra
    // const buy = new Buy({
    //     total,
    //     user,
    //     products
    // });

    const buy = new Buy ( data );

    // Guardar en la base de datos
    await buy.save();

    res.status(201).json(buy);
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

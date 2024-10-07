const { response, request } = require("express");

const Product = require("../models/buy");

const { response, request } = require("express");
const Buy = require("../models/buy");

// Obtener compras - paginado - total - Populate
const getBuys = async (req, res = response) => {
    const { limit = 25, desde = 0 } = req.query; // Parámetros de paginación
    const query = { state: true }; // Solo obtener compras activas

    const [total, buys] = await Promise.all([
        Buy.countDocuments(query), // Contar total de compras activas
        Buy.find(query)
            .populate('user', 'name') // Popular datos del usuario
            .populate('products.product', 'name price') // Popular datos del producto (nombre y precio)
            .skip(Number(desde)) // Saltar los primeros resultados según la paginación
            .limit(Number(limit)) // Limitar el número de resultados por página
    ]);

    res.json({
        total,
        buys
    });
};

// Crear compra
const createBuy = async (req, res = response) => {
    const { state, user, ...body } = req.body;

    // Validar si la compra ya existe (si hay algún campo único para validar, puedes agregarlo aquí)

    // Datos a guardar en la nueva compra
    const data = {
        ...body,
        user: req.user._id // Asignar el usuario que está realizando la compra
    };

    const buy = new Buy(data);

    // Guardar en la base de datos
    await buy.save();

    res.status(201).json(buy);
};

module.exports = {
    getBuys,
    createBuy
};

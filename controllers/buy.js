const { response } = require("express");
const Buy = require("../models/buy");
const Product = require("../models/product");
const mongoose = require("mongoose");
const Pay = require("../models/pay");

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
            .populate("pay", "numberpay amountpay date ")
            .skip(Number(desde))
            .limit(Number(limit))
    ]);

    res.json({
        total,
        buys
    });
};

const getBuyByUser = async (req, res = response) => {
    const { limit = 25, desde = 0 } = req.query;
    const { id } = req.params;
    const query = { $and : [{state: true}, {user : id}] };

    const [total, buys] = await Promise.all([
        Buy.countDocuments(query),
        Buy.find(query)
            .populate("user", "name")
            .populate("client", "dni name phone address")
            .populate("products.product", "name price description")
            .populate("pay", "numberpay amountpay date ")
            .skip(Number(desde))
            .limit(Number(limit))
    ]);

    res.json({
        total,
        buys
    });
};
const getBuyByClient = async (req, res = response) => {
    const { limit = 25, desde = 0 } = req.query;
    const { id } = req.params;
    const query = { $and : [{state: true}, {client : id}] };

    const [total, buys] = await Promise.all([
        Buy.countDocuments(query),
        Buy.find(query)
            .populate("user", "name")
            .populate("client", "dni name phone address")
            .populate("products.product", "name price description")
            .populate("pay", "numberpay amountpay date ")
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
        .populate("products.product", "name price description")
        .populate("pay", "numberpay amountpay date ")

    if (!buy) {
        return res.status(404).json({
            msg: "Compra no encontrada"
        });
    }

    res.json(buy);
};

// Crear una nueva compra
const createBuy = async (req, res = response) => {
    const { products,pay, ...data } = req.body;
console.log(pay);

    try {

       const payBuy = new Pay ({
        amountpay : pay.amountpay,
        numberpay : pay.numberpay
        
       })
       console.log(payBuy);
       
       const newpay = await payBuy.save();

        for (const item of products) {
            const product = await Product.findById(item.product);

            product.stock -= item.quantity;

            await Product.findByIdAndUpdate(product._id, product, { new: true });

        }
        
        const buy = new Buy({
            ...data,
            user : req.usuario._id,
             pay:newpay._id,
             products
        });

        await buy.save();
       const newbuy = await Buy.findById (buy._id)
       .populate("user", "name")
       .populate("client", "dni name phone address")
       .populate("products.product", "name description price ")
       .populate("pay", "numberpay amountpay date ")
        res.status(201).json(newbuy);


    } catch (error) {
      
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
    getBuys,
    getBuyById,
    createBuy,
    updateBuy,
    deleteBuy,
    getBuyHistory,
    getBuyByUser,
    getBuyByClient
};

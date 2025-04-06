const { response } = require("express");
const Buy = require("../models/buy");
const Product = require("../models/product");
const mongoose = require("mongoose");
const Pay = require("../models/pay");
const { v4: uuidv4 } = require ('uuid');
const User = require("../models/user");
const Client = require("../models/client");

// Obtener todas las compras - paginado - total
const getBuys = async (req, res) => {
    const { limit = 25, desde = 0 } = req.query;

    try {
        const { count, rows: buys } = await Buy.findAndCountAll({
            where: { state: true },
            include: [
                { model: User, attributes: ['name'] },
                { model: Client, attributes: ['dni', 'name', 'phone', 'address'] },
                { model: Pay, attributes: ['numberpay', 'amountpay', 'date'] },
                { 
                    model: Product,
                    through: { attributes: ['quantity'] },
                    as: 'products',
                    attributes: ['name', 'price', 'description']
                }
            ],
            offset: Number(desde),
            limit: Number(limit)
        });

        res.json({ total: count, buys });
        
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener compras' });
    }
};

// Obtener compras por usuario
const getBuyByUser = async (req, res) => {
    const { limit = 25, desde = 0 } = req.query;
    const { id } = req.params;

    try {
        const { count, rows: buys } = await Buy.findAndCountAll({
            where: { 
                state: true,
                userId: id 
            },
            include: [
                { model: User, attributes: ['name'] },
                { model: Client, attributes: ['dni', 'name', 'phone', 'address'] },
                { model: Pay, attributes: ['numberpay', 'amountpay', 'date'] },
                { 
                    model: Product,
                    through: { attributes: ['quantity'] },
                    as: 'products',
                    attributes: ['name', 'price', 'description']
                }
            ],
            offset: Number(desde),
            limit: Number(limit)
        });

        res.json({ total: count, buys });
        
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener compras' });
    }
};

// Obtener compras por cliente
const getBuyByClient = async (req, res) => {
    const { limit = 25, desde = 0 } = req.params;
    const { id } = req.params;

    try {
        const { count, rows: buys } = await Buy.findAndCountAll({
            where: { 
                state: true,
                clientId: id 
            },
            include: [
                { model: User, attributes: ['name'] },
                { model: Client, attributes: ['dni', 'name', 'phone', 'address'] },
                { model: Pay, attributes: ['numberpay', 'amountpay', 'date'] },
                { 
                    model: Product,
                    through: { attributes: ['quantity'] },
                    as: 'products',
                    attributes: ['name', 'price', 'description']
                }
            ],
            offset: Number(desde),
            limit: Number(limit)
        });

        res.json({ total: count, buys });
        
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener compras' });
    }
};

// Obtener compra por ID
const getBuyById = async (req, res) => {
    const { id } = req.params;

    try {
        const buy = await Buy.findByPk(id, {
            include: [
                { model: User, attributes: ['name'] },
                { model: Client, attributes: ['dni', 'name', 'phone', 'address'] },
                { model: Pay, attributes: ['numberpay', 'amountpay', 'date'] },
                { 
                    model: Product,
                    through: { attributes: ['quantity'] },
                    as: 'products',
                    attributes: ['name', 'price', 'description']
                }
            ]
        });

        if (!buy) return res.status(404).json({ msg: "Compra no encontrada" });
        
        res.json(buy);
        
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener compra' });
    }
};

// Crear nueva compra
const createBuy = async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        const { products, ...data } = req.body;
        const numberpay = uuidv4();

        // Crear pago
        const pay = await Pay.create({
            numberpay,
            amountpay: data.total,
            date: new Date()
        }, { transaction });

        // Actualizar stock y validar productos
        for (const item of products) {
            const product = await Product.findByPk(item.productId, { transaction });
            
            if (!product) {
                await transaction.rollback();
                return res.status(400).json({ msg: `Producto ${item.productId} no existe` });
            }
            
            if (product.stock < item.quantity) {
                await transaction.rollback();
                return res.status(400).json({ msg: `Stock insuficiente para ${product.name}` });
            }

            await product.decrement('stock', { 
                by: item.quantity,
                transaction 
            });
        }

        // Crear compra
        const buy = await Buy.create({
            ...data,
            userId: req.usuario.id,
            payId: pay.id
        }, { transaction });

        // Crear relaciones con productos
        await buy.setProducts(products.map(p => ({
            productId: p.productId,
            quantity: p.quantity
        })), { transaction });

        await transaction.commit();
        
        const newBuy = await Buy.findByPk(buy.id, {
            include: [
                { model: User, attributes: ['name'] },
                { model: Client },
                { model: Pay },
                { model: Product, through: { attributes: ['quantity'] } }
            ]
        });

        res.status(201).json(newBuy);
        
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ msg: error.message });
    }
};

// Actualizar compra
const updateBuy = async (req, res) => {
    const { id } = req.params;

    try {
        const buy = await Buy.findByPk(id);
        if (!buy) return res.status(404).json({ msg: "Compra no encontrada" });

        await buy.update(req.body);
        res.json(buy);
        
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar compra' });
    }
};

// Eliminar compra (cambio de estado)
const deleteBuy = async (req, res) => {
    const { id } = req.params;

    try {
        const buy = await Buy.findByPk(id);
        if (!buy) return res.status(404).json({ msg: "Compra no encontrada" });

        await buy.update({ state: false });
        res.json(buy);
        
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar compra' });
    }
};

// Historial de compras por usuario
const getBuyHistory = async (req, res) => {
    const { userId } = req.params;

    try {
        const buys = await Buy.findAll({
            where: { userId },
            include: [
                { 
                    model: Product,
                    through: { attributes: ['quantity'] },
                    attributes: ['name', 'price']
                },
                { model: User, attributes: ['name'] }
            ]
        });

        res.json({
            totalCompras: buys.length,
            historial: buys
        });
        
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener historial' });
    }
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

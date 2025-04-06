const { response, request } = require("express");
const path = require('path'); 
const fs = require('fs');
const Product = require("../models/product");
const { uploadsFiles } = require("../helpers/upload-files");
const { Result } = require("express-validator");
const { dbConnection } = require("../database/config");
const Category = require("../models/category");
const User = require("../models/user");

const getProductByCategory = async (req, res) => {
    const { limit = 25, desde = 0 } = req.params;
    const { id } = req.params;

    try {
        const { count, rows: products } = await Product.findAndCountAll({
            where: { 
                state: true,
                categoryId: id 
            },
            include: [{ 
                model: Category,
                attributes: ['name'],
                required: true
            }],
            offset: Number(desde),
            limit: Number(limit)
        });

        res.json({ total: count, products });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener productos' });
    }
};

const getProducts = async (req, res) => {
    const { limit = 25, desde = 0 } = req.query;

    try {
        const { count, rows: products } = await Product.findAndCountAll({
            where: { state: true },
            include: [
                { model: User, attributes: ['name'] },
                { model: Category, attributes: ['name'] }
            ],
            offset: Number(desde),
            limit: Number(limit)
        });

        res.json({ total: count, products });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener productos' });
    }
};

const getProductByID = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findByPk(id, {
            include: [
                { model: User, attributes: ['name'] },
                { model: Category, attributes: ['name'] }
            ]
        });

        if (!product || !product.state) {
            return res.status(400).json({ msg: 'Producto no encontrado o desactivado' });
        }

        res.json(product);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener producto' });
    }
};

const createProduct = async (req, res) => {
    const { state, ...body } = req.body;

    try {
        body.name = body.name.toUpperCase();
        
        const existProduct = await Product.findOne({ where: { name: body.name } });
        if (existProduct) {
            return res.status(400).json({ msg: `El producto ${body.name} ya existe` });
        }

        const productData = {
            ...body,
            userId: req.usuario.id
        };

        const product = await Product.create(productData);

        // Subir archivo (mantén tu lógica actual)
        if (req.files) {
            const nameFile = await uploadsFiles(req.files, undefined, 'products', product.id);
            await product.update({ images: nameFile });
        }

        res.status(201).json(product);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al crear producto' });
    }
};

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { state, ...dataProduct } = req.body;

    try {
        const product = await Product.findByPk(id);
        if (!product) return res.status(404).json({ msg: 'Producto no encontrado' });

        // Actualizar imagen
        if (req.files) {
            // Mantén tu lógica actual de manejo de archivos
            if (product.images) {
                const pathImage = path.join(__dirname, '../uploads', 'products', product.images);
                if (fs.existsSync(pathImage)) {
                    fs.unlinkSync(pathImage);
                }
            }
            
            const nameFile = await uploadsFiles(req.files, undefined, 'products', product.id);
            dataProduct.images = nameFile;
        }

        if (dataProduct.name) dataProduct.name = dataProduct.name.toUpperCase();

        await product.update(dataProduct);
        res.json(product);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar producto' });
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findByPk(id);
        if (!product) return res.status(404).json({ msg: 'Producto no encontrado' });

        await product.update({ state: false });
        res.json({ msg: 'Producto desactivado correctamente' });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al eliminar producto' });
    }
};
module.exports = {
    createProduct,
    getProducts,
    getProductByID,
    updateProduct,
    deleteProduct,
    getProductByCategory,
};

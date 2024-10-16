const { response, request } = require("express");
const Product = require("../models/product");

// Obtener productos - paginado - total - Populate
const getProducts = async (req, res = response) => {
    const { limit = 25, desde = 0 } = req.query;
    const query = { state: true };

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .populate("user", "name")
            .skip(Number(desde))
            .limit(Number(limit)),
    ]);

    res.json({
        total,
        products,
    });
};

// Obtener Producto por ID: populate
const getProductByID = async (req, res = response) => {
    const { id } = req.params;

    const product = await Product.findById(id);

   
    if (!product.state) {
        res.status(400).json({
            msg: 'El producto se encuentra desactivado',
        });
    }

    res.json(product);
};

// Crear Producto con validación de archivo
const createProduct = async (req, res = response) => {
    // Validar archivo subido
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.uploadFile) {
        return res.status(400).json({
            msg: 'No hay archivos que subir - ValidateFilesUpload',
        });
    }

    const { state, user, ...body } = req.body;

    body.name = body.name.toUpperCase();

    const existProduct = await Product.findOne({ name: body.name });

    if (existProduct) {
        return res.status(400).json({
            msg: `El producto ${existProduct.name}, ya existe`,
        });
    }

    const data = {
        ...body,
        user: req.usuario._id,
    };

    const product = new Product(data);

    await product.save();

    res.status(201).json(product);
};

// Actualizar Producto
const updateProduct = async (req, res = response) => {
    const { id } = req.params;
    const { state, user, ...dataProduct } = req.body;

    if (dataProduct.name) {
        dataProduct.name = dataProduct.name.toUpperCase();
    }
    const product = await Product.findByIdAndUpdate(id, dataProduct, { new: true });

    res.json({
        product,
    });
};

// Desactivar o Borrar producto
const deleteProduct = async (req, res = response) => {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, { state: false }, { new: true });

    res.json({
        product,
    });
};

module.exports = {
    createProduct,
    getProducts,
    getProductByID,
    updateProduct,
    deleteProduct,
};

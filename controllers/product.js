const { response, request } = require("express");
const path = require('path'); 
const fs = require('fs');

const Product = require("../models/product");
const { uploadsFiles } = require("../helpers/upload-files");
const category = require("../models/category");

const getProductByCategory = async (req, res = response) => {
    const { limit = 25, desde = 0 } = req.query;
    const { id } = req.params;
    const query = { $and : [{state: true}, {category : id}] };

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .populate("category","name")       
            .skip(Number(desde))
            .limit(Number(limit))
    ]);

    res.json({
    total,
    products    
    });
};


// Obtener productos - paginado - total - Populate
const getProducts = async (req, res = response) => {
    const { limit = 25, desde = 0 } = req.query;
    const query = { state: true };

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .populate("user", "name")
            .populate("category", "name")
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

    const product = await Product.findById(id)
            .populate("user", "name")
            .populate("category", "name");
    


   
    if (!product.state) {
        res.status(400).json({
            msg: 'El producto se encuentra desactivado',
        });
    }

    res.json(product);
};

// Crear Producto con validación de archivo
const createProduct = async (req, res = response) => {
  

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



      // subir Archivo
      const nameFile = await uploadsFiles ( req.files, undefined, 'products', product._id );
      product.images = nameFile;  
      
     await Product.findByIdAndUpdate(product._id, product, { new: true });

    res.status(201).json(product);
};




// Actualizar Producto
const updateProduct = async (req, res = response) => {
    const { id } = req.params;
    const { state, user, ...dataProduct } = req.body;
   

// actualizar imagen
  // limpiar imagen previas

    if (req.files)  {
        if ( Object.keys(req.files).length >= 0 && req.files.uploadFile) {
            const productExist = await Product.findById(id);
        
            if ( productExist.images ) {
                // borrar la imagen del servidor
                const pathImage = path.join( __dirname, '../uploads', 'products', productExist.images );
                //validar si existe en archivo del filesystem
                if (fs.existsSync( pathImage )){
                    fs.unlinkSync( pathImage );   // elimina el archivo de la ruta             
                }
            }

            // subir Archivo
            const nameFile = await uploadsFiles ( req.files, undefined, 'products', productExist._id  );
            dataProduct.images = nameFile
        }
    }

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
    getProductByCategory,
};

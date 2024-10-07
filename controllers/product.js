const { response, request } = require("express");

const Product = require("../models/product");


//obtenerCategorias - paginado - total - Populate
const getProducts  = async ( req, res = response) => {
  
    const { limit = 25 , desde = 0 } = req.query; 
    const query =  { state : true };

    const [ total, products ] = await Promise.all([
        Product.countDocuments( query ),
        Product.find( query )           
            .skip( Number( desde ))
            .limit(Number( limit ))
    ]);

    res.json({
        total,
        products
    });

   
}

//Obtener Categoria por ID : populate
const getProductByID = async ( req , res = response ) => {
    
    const { id } = req.params;

      
    const product = await Product.findById( id );

    if ( !product.state ) {
        res.status(400).json({
           msg: 'Producto se encuentra desactivada'
        });
    }

    res.json( product );
}


// crear Producto
const createProduct = async (req , res = response) => {
    
    const { state, user, ...body } = req.body

    body.name = body.name.toUpperCase();
    

   
    const existProduct = await Product.findOne({ name: body.name } );
    
    
    if (existProduct) {
        return res.status(400).json({
            msg: `La Producto ${ existProduct.name }, ya existe`
        });
    }



    const data = {
        ...body
    }

    const product = new Product ( data );

    await product.save();

    res.status(201).json( product );

}
// Actualizar Producto
const updateProduct = async ( req, res = response ) => {
    
    const { id } = req.params;
    const { state, user, ...dataProduct } = req.body

    if ( dataProduct.name ){
        dataProduct.name = dataProduct.name.toUpperCase();
    }
    const product = await Product.findByIdAndUpdate( id, dataProduct , { new: true });

    res.json({
        product
    })

}

// desactivar o Borrar categoria
const deleteProduct = async ( req, res= response) => {
    const { id } = req.params;
 
    const product = await Product.findByIdAndUpdate(id, { state : false } , { new: true });

    res.json({
        product
    })

}



    
module.exports = {
    createProduct,   
    getProducts,
    getProductByID,
    updateProduct,
    deleteProduct
}
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



    
module.exports = {
    createProduct,   
    getProducts
  
}
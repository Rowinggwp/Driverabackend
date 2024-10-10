const { Router } = require ('express');

const { getProducts, createProduct, getProductByID, deleteProduct, updateProduct } = require('../controllers/product');

const router = Router();


  
  router.get('/', getProducts );

  router.get('/findAll', getProducts );

  router.get('/:id', getProductByID );


  router.post('/', createProduct )

  router.put('/:id', updateProduct );

  router.delete('/:id', deleteProduct );




  module.exports = router;
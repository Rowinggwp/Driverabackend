const { Router } = require ('express');

const { getProducts, createProduct } = require('../controllers/product');

const router = Router();


  
  router.get('/', getProducts );

  router.get('/findAll', getProducts );

  router.post('/', 
    createProduct
  )





  module.exports = router;
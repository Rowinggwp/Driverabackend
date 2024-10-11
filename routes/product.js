const { Router } = require ('express');
const { check } = require('express-validator');
const { getProducts, createProduct, getProductByID, deleteProduct, updateProduct } = require('../controllers/product');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');


const router = Router();
  router.get('/', getProducts );
  router.get('/findAll', getProducts );
  router.get('/:id', getProductByID );

  router.post('/',[ 
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
   // check('category', 'El categoria no es un Id Válido').isMongoId(),
   // check('category').custom ( existCategoryById ),
    validateFields
  ], createProduct )

  
  router.put('/:id', updateProduct );
  router.delete('/:id', deleteProduct );




  module.exports = router;
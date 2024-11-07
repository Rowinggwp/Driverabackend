const { Router } = require ('express');
const { check } = require('express-validator');

const { 
    uploadFiles, 
    updateImgs,
    showImage,
  } = require('../controllers/upload');

const { 
    colletionExists 
  } = require('../helpers/db-validators');
const { validateFields } = require('../middlewares/validate-fields');
const { validateFilesUpload } = require('../middlewares/validate-files-upload');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/:colletion/:id', [  
  check('id','El Id no es un ID válido').isMongoId(),
  check('colletion').custom( c => colletionExists ( c, ['users', 'products'] ) ),
  validateFields
], showImage )

router.post('/', validateFilesUpload , uploadFiles);

router.put('/:colletion/:id', [
  validateJWT,
  validateFilesUpload,
  check('id','El Id no es un ID válido').isMongoId(),
  check('colletion').custom( c => colletionExists ( c, ['users', 'products'] ) ),
  validateFields  
], updateImgs );


module.exports = router;

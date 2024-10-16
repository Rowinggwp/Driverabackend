const { Router } = require('express');
const { check } = require('express-validator');
const { getBuys, getBuyById, createBuy, updateBuy, deleteBuy } = require('../controllers/buy');
const { validateFields } = require('../middlewares/validate-fields');
const { existBuyById } = require('../helpers/db-validators');

const router = Router();

router.get('/', getBuys);

router.get('/:id', [
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(existBuyById),
    validateFields
], getBuyById);

router.post('/', createBuy);

router.put('/:id', [
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(existBuyById),
    validateFields
], updateBuy);

router.delete('/:id', [
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(existBuyById),
    validateFields
], deleteBuy);

module.exports = router;

const { Router } = require('express');
const { check } = require('express-validator');
const { getClients, createClient, updateClient, deleteClient, getClientById } = require('../controllers/client');
const { validateFields } = require('../middlewares/validate-fields');
const { existClientById } = require('../helpers/db-validators');

const router = Router();

router.get('/', getClients);

router.get('/:id', [
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(existClientById),
    validateFields
], getClientById);

router.post('/', createClient);

router.put('/:id', [
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(existClientById),
    validateFields
], updateClient);

router.delete('/:id', [
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(existClientById),
    validateFields
], deleteClient);

module.exports = router;

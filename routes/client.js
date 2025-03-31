const { Router } = require('express');
const { check } = require('express-validator');
const { getClients, createClient, updateClient, deleteClient, getClientById } = require('../controllers/client');
const { validateFields } = require('../middlewares/validate-fields');
const { existClientById, isEmailUnique } = require('../helpers/db-validators');
const { validateJWT } = require('../middlewares/validate-jwt');
const { isAdminRole } = require('../middlewares/validate-roles');

const router = Router();

router.get('/', [
    validateJWT, 
    isAdminRole, 
], getClients);

router.get('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(existClientById),
    validateFields
], getClientById);

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email no es válido').isEmail(),
// check('email').custom(isEmailUnique), 
    check('phone', 'El teléfono debe ser un número válido').matches(/^[0-9]{10}$/), 
    validateFields
], createClient);

router.put('/:id', [
    validateJWT,
    isAdminRole, 
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(existClientById),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email no es válido').isEmail(),
    check('email').custom(isEmailUnique),
    validateFields
], updateClient);

router.delete('/:id', [
    validateJWT,
    isAdminRole, 
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(existClientById),
    validateFields
], deleteClient);

module.exports = router;

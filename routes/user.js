const { Router } = require('express');
const { check } = require('express-validator');
const { getUsers, createUser, updateUser, deleteUser, getUserById, getUserByToken } = require('../controllers/user');
const { validateFields } = require('../middlewares/validate-fields');
const { existUserById, isEmailUnique } = require('../helpers/db-validators');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/', getUsers);

router.get('/byuser', [ 
    validateJWT,
    validateFields,
 ] , getUserByToken);

router.get('/:id', [
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(existUserById),
    validateFields
], getUserById);

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El correo no es válido').isEmail(),
    check('email').custom(isEmailUnique), 
    check('password', 'La contraseña debe ser de al menos 6 caracteres').isLength({ min: 6 }),
    validateFields
], createUser);

router.put('/:id', [
    validateJWT,
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(existUserById),
    validateFields
], updateUser);

router.delete('/:id', [
    validateJWT,
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(existUserById),
    validateFields
], deleteUser);

module.exports = router;

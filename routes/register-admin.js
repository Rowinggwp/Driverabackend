const { Router } = require('express');
const { check } = require('express-validator');
const { registerAdmin } = require('../controllers/register-admin');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT} = require('../middlewares/validate-jwt');
const { isAdminRole } = require('../middlewares/validate-roles');

const router = Router();

router.post('/', [
    validateJWT,  // Solo un admin puede crear otro admin
    isAdminRole,  // Verifica que el usuario autenticado sea admin
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña debe tener mínimo 6 caracteres').isLength({ min: 6 }),
    validateFields
], registerAdmin);

module.exports = router;

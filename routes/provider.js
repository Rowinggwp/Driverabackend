const { Router } = require("express");
const { check } = require("express-validator");


const { validateFields } = require("../middlewares/validate-fields");
const { getProviders, getProviderById, createProvider, updateProvider, deleteProvider } = require("../controllers/provider");



const router = Router();

// Obtener todos los proveedores
router.get('/', getProviders);

// Obtener un proveedor por ID
router.get('/:id', getProviderById);

// Crear un nuevo proveedor con validaciones
router.post(
    '/',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('company', 'El nombre de la empresa es obligatorio').not().isEmpty(),
        check('contact', 'El contacto es obligatorio').not().isEmpty(),
        check('email', 'El correo no es válido').isEmail(),
        check('phone', 'El teléfono es obligatorio').not().isEmpty(),
        validateFields
    ],
    createProvider
);

// Actualizar un proveedor
router.put('/:id', updateProvider);

// Eliminar un proveedor (cambio de estado)
router.delete('/:id', deleteProvider);

module.exports = router;

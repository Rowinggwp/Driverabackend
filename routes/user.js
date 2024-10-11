const { Router } = require('express');
const { getUsers, createUser, updateUser, deleteUser, getUserById } = require('../controllers/user');

const router = Router();
    router.get('/', getUsers);
    router.get('/:id', getUserById);
    router.post('/', createUser);
    router.put('/:id', updateUser);
    router.delete('/:id', deleteUser);

module.exports = router;

const { Router } = require('express');
const { getClients, createClient, updateClient, deleteClient, getClientById } = require('../controllers/client');

const router = Router();
    router.get('/', getClients);
    router.get('/:id', getClientById);
    router.post('/', createClient);
    router.put('/:id', updateClient);
    router.delete('/:id', deleteClient);

module.exports = router;

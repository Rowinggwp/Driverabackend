const { response, request } = require('express');
const Client = require('../models/client');

// Obtener clientes - paginado
const getClients = async (req, res = response) => {
    const { limit = 25, desde = 0 } = req.query;
    const query = { state: true };

    const [total, clients] = await Promise.all([
        Client.countDocuments(query),
        Client.find(query).skip(Number(desde)).limit(Number(limit))
    ]);

    res.json({
        total,
        clients
    });
};

// Crear cliente
const createClient = async (req, res = response) => {
    const { dni, name, gmail, phone } = req.body;

    const client = new Client({ dni, name, gmail, phone });
    await client.save();

    res.status(201).json(client);
};

// Actualizar cliente
const updateClient = async (req = request, res = response) => {
    const { id } = req.params;
    const { state, ...data } = req.body;

    const client = await Client.findByIdAndUpdate(id, data, { new: true });

    res.json(client);
};

// Eliminar cliente
const deleteClient = async (req = request, res = response) => {
    const { id } = req.params;

    // Opción 1: Eliminar físicamente
    // const client = await Client.findByIdAndDelete(id);

    // Opción 2: Cambiar el estado
    const client = await Client.findByIdAndUpdate(id, { state: false }, { new: true });

    res.json(client);
};

// Obtener cliente por ID
const getClientById = async (req, res = response) => {
    const { id } = req.params;
    const client = await Client.findById(id);

    if (!client || !client.state) {
        return res.status(404).json({
            msg: 'Cliente no encontrado'
        });
    }

    res.json(client);
};

module.exports = {
    getClients,
    createClient,
    updateClient,
    deleteClient,
    getClientById
};

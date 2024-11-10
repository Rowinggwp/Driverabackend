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

const createClient = async (req, res = response) => {
    const { dni, name, email, ...data } = req.body;

    // Buscar si ya existe un cliente con el mismo DNI, nombre y email
    const existingClient = await Client.findOne({ dni, name, email });

    if (existingClient) {
        const updatedData = { dni, name, email, ...data };

        // Reemplazar completamente el documento existente
        const updatedClient = await Client.findByIdAndUpdate(
            existingClient._id,
            updatedData,
            { new: true }
        );

        return res.status(200).json({
            msg: 'Cliente actualizado y reemplazado',
            client: updatedClient
        });
    }

    // Si no existe, creamos un nuevo cliente
    const client = new Client({ dni, name, email, ...data });
    await client.save();

    res.status(201).json({
        msg: 'Cliente creado',
        client
    });
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

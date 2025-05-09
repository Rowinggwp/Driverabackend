const { response, request } = require('express');
const Client = require('../models/client');

// Obtener clientes - paginado
const getClients = async (req, res) => {
    const { limit = 25, desde = 0 } = req.query;

    try {
        const { count, rows: clients } = await Client.findAndCountAll({
            where: { state: true },
            offset: Number(desde),
            limit: Number(limit),
            attributes: { exclude: ['password'] } // Si tienes campo password
        });

        res.json({ total: count, clients });
        
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener clientes' });
    }
};

const createClient = async (req, res) => {
    const { dni, state, ...data } = req.body;

    try {
        // Buscar cliente existente por DNI
        const existingClient = await Client.findOne({ where: { dni } });

        if (existingClient) {
            // Actualizar cliente existente
            await existingClient.update({ dni, ...data });
            
            return res.status(200).json({
                msg: 'Cliente actualizado y reemplazado',
                client: existingClient
            });
        }

        // Crear nuevo cliente
        const client = await Client.create({ dni, ...data });
        
        res.status(201).json({
            msg: 'Cliente creado',
            client
        });
        
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear cliente' });
    }
};

// Actualizar cliente
const updateClient = async (req, res) => {
    const { id } = req.params;
    const { state, ...data } = req.body;

    try {
        const client = await Client.findByPk(id);
        
        if (!client) {
            return res.status(404).json({ msg: 'Cliente no encontrado' });
        }

        await client.update(data);
        res.json(client);
        
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar cliente' });
    }
};

// Eliminar cliente (cambio de estado)
const deleteClient = async (req, res) => {
    const { id } = req.params;

    try {
        const client = await Client.findByPk(id);
        
        if (!client) {
            return res.status(404).json({ msg: 'Cliente no encontrado' });
        }

        await client.update({ state: false });
        res.json({ msg: 'Cliente desactivado', client });
        
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar cliente' });
    }
};

// Obtener cliente por ID
const getClientById = async (req, res) => {
    const { id } = req.params;

    try {
        const client = await Client.findByPk(id, {
            attributes: { exclude: ['password'] } // Si aplica
        });
        
        if (!client || !client.state) {
            return res.status(404).json({ msg: 'Cliente no encontrado' });
        }

        res.json(client);
        
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener cliente' });
    }
};

module.exports = {
    getClients,
    createClient,
    updateClient,
    deleteClient,
    getClientById
};

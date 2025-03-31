const { response, request } = require('express');
const Provider = require('../models/provider');

// Obtener todos los proveedores
const getProviders = async (req = request, res = response) => {
    try {
        const providers = await Provider.find();
        res.json({ ok: true, providers });
    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Error interno del servidor' });
    }
};

// Obtener un proveedor por ID
const getProviderById = async (req = request, res = response) => {
    const { id } = req.params;
    try {
        const provider = await Provider.findById(id);
        if (!provider) {
            return res.status(404).json({ ok: false, msg: 'Proveedor no encontrado' });
        }
        res.json({ ok: true, provider });
    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Error interno del servidor' });
    }
};

// Crear un nuevo proveedor
const createProvider = async (req = request, res = response) => {
    try {
        const { name, email } = req.body;
        // Verificar si el proveedor ya existe
        const existingProvider = await Provider.findOne({ email });
        if (existingProvider) {
            return res.status(400).json({ ok: false, msg: 'El proveedor ya existe con este correo' });
        }

        const provider = new Provider(req.body);
        await provider.save();
        res.status(201).json({ ok: true, provider });
    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Error interno del servidor' });
    }
};

// Actualizar un proveedor
const updateProvider = async (req = request, res = response) => {
    const { id } = req.params;
    try {
        const provider = await Provider.findByIdAndUpdate(id, req.body, { new: true });
        if (!provider) {
            return res.status(404).json({ ok: false, msg: 'Proveedor no encontrado' });
        }
        res.json({ ok: true, provider });
    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Error interno del servidor' });
    }
};

// Eliminar un proveedor (cambio de estado en lugar de eliminación física)
const deleteProvider = async (req = request, res = response) => {
    const { id } = req.params;
    try {
        const provider = await Provider.findByIdAndUpdate(id, { state: false }, { new: true });
        if (!provider) {
            return res.status(404).json({ ok: false, msg: 'Proveedor no encontrado' });
        }
        res.json({ ok: true, msg: 'Proveedor eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Error interno del servidor' });
    }
};

module.exports = {
    getProviders,
    getProviderById,
    createProvider,
    updateProvider,
    deleteProvider
};

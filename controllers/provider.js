const { response, request } = require('express');
const Provider = require('../models/provider');

const getProviders = async (req, res) => {
    try {
        const providers = await Provider.findAll();
        res.json({ ok: true, providers });
    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Error interno del servidor' });
    }
};

const getProviderById = async (req, res) => {
    const { id } = req.params;
    try {
        const provider = await Provider.findByPk(id);
        if (!provider) {
            return res.status(404).json({ ok: false, msg: 'Proveedor no encontrado' });
        }
        res.json({ ok: true, provider });
    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Error interno del servidor' });
    }
};

const createProvider = async (req, res) => {
    try {
        const { name, email } = req.body;
        
        // Verificar si el proveedor ya existe
        const existingProvider = await Provider.findOne({ 
            where: { email } 
        });
        
        if (existingProvider) {
            return res.status(400).json({ 
                ok: false, 
                msg: 'El proveedor ya existe con este correo' 
            });
        }

        const provider = await Provider.create(req.body);
        res.status(201).json({ ok: true, provider });
        
    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Error interno del servidor' });
    }
};

const updateProvider = async (req, res) => {
    const { id } = req.params;
    try {
        const provider = await Provider.findByPk(id);
        if (!provider) {
            return res.status(404).json({ ok: false, msg: 'Proveedor no encontrado' });
        }
        
        await provider.update(req.body);
        res.json({ ok: true, provider });
        
    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Error interno del servidor' });
    }
};

const deleteProvider = async (req, res) => {
    const { id } = req.params;
    try {
        const provider = await Provider.findByPk(id);
        if (!provider) {
            return res.status(404).json({ ok: false, msg: 'Proveedor no encontrado' });
        }
        
        await provider.update({ state: false });
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

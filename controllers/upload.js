const path = require('path'); 
const fs = require('fs');
const { response } = require("express");
const User = require('../models/user');
const Product = require('../models/product');
const { uploadsFiles } = require('../helpers/upload-files');
const { log } = require('console');


const uploadFiles = async (req, res = response) => {
    try {
        const nameFile = await uploadsFiles(req.files, undefined, 'imgs');
        res.json({ nameFile });
    } catch (msg) {
        res.status(400).json({ msg });
    }
};

const updateImgs = async (req, res = response) => {
    const { id, colletion } = req.params;

    try {
        let model;
        switch (colletion) {
            case 'users':
                model = await User.findByPk(id);
                if (!model) {
                    return res.status(400).json({ msg: `No existe un usuario con el Id ${id}` });
                }
                break;

            case 'products':
                model = await Product.findByPk(id);
                if (!model) {
                    return res.status(400).json({ msg: `No existe un producto con el Id ${id}` });
                }
                // Asignar usuario relacionado
                model.userId = req.usuario.id;
                await model.save();
                break;

            default:
                return res.status(500).json({ msg: 'Se me olvido validar eso' });
        }

        // Limpiar imagen previa
        if (model.images) {
            const pathImage = path.join(__dirname, '../uploads', colletion, model.images);
            if (fs.existsSync(pathImage)) {
                fs.unlinkSync(pathImage);
            }
        }

        // Subir nuevo archivo
        const nameFile = await uploadsFiles(req.files, undefined, colletion, model.id);
        await model.update({ images: nameFile });

        res.json({ model });

    } catch (msg) {
        res.status(400).json({ msg });
    }
};

const showImage = async (req, res = response) => {
    const { id, colletion } = req.params;

    try {
        let model;
        switch (colletion) {
            case 'users':
                model = await User.findByPk(id);
                break;

            case 'products':
                model = await Product.findByPk(id);
                break;

            default:
                return res.status(500).json({ msg: 'Se me olvido validar eso' });
        }

        if (!model) {
            return res.status(404).json({ msg: 'Registro no encontrado' });
        }

        // Mostrar imagen si existe
        if (model.images) {
            const pathImage = path.join(__dirname, '../uploads', colletion, model.images);
            if (fs.existsSync(pathImage)) {
                return res.sendFile(pathImage);
            }
        }

        // Imagen por defecto
        const defaultImage = path.join(__dirname, '../assets/no-image.jpg');
        if (fs.existsSync(defaultImage)) {
            return res.sendFile(defaultImage);
        }

        res.json({ msg: 'Falta Placeholder' });

    } catch (msg) {
        console.log(msg);
        res.status(400).json({ msg });
    }
};

module.exports = {
    uploadFiles,
    updateImgs,
    showImage,
}
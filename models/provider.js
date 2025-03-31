const { Schema, model } = require('mongoose');
const product = require('./product');

const ProviderSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    company: {
        type: String,
        required: [true, 'El nombre de la empresa es obligatorio']
    },
    contact: {
        type: String,
        required: [true, 'El contacto es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true,
    },
    phone: {
        type: String,
        required: [true, 'El teléfono es obligatorio']
    },
    productexport:{
        type: String,
        required: [true, 'debe cologar el producto exportado']
    },
    address: {
        type: String,
        default: ''
    },
    state: {
        type: Boolean,
        default: true,
        required: true
    }
});

// Remover __v al devolver como JSON
ProviderSchema.methods.toJSON = function () {
    const { __v, ...providerObject } = this.toObject();
    return providerObject;
}

module.exports = model('Provider', ProviderSchema);

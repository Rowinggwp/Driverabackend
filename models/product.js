const { Schema, model } = require('mongoose');
const category = require('./category');

const ProductSchema = Schema({ 
    
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    title: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        default: 0,
        min: [0, 'El precio no puede ser negativo']
    },    
    state: {
        type: Boolean,
        default: true,
        required: true
    },
    stock: {
        type: Number,
        required: [true, 'El stock es obligatorio'],
        default: 0,
        min: [0, 'El stock no puede ser negativo']
    },
    images: {
        type: String,  // Permite manejar múltiples imágenes    
   },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
});

// Remover __v y cualquier otra propiedad sensible al devolver el producto como JSON
ProductSchema.methods.toJSON = function () {
    const { __v, ...productObject } = this.toObject();
    return productObject;
}

module.exports = model('Product', ProductSchema);

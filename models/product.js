const { Schema, model } = require('mongoose');

const ProductSchema = Schema({ 
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        default:0
    },    
    state: {
        type: Boolean,
        default: true,
        required: true
    },
    stock : {
        type: Boolean,
        default: true
    },
    img: {
        type: String
    }
});


ProductSchema.methods.toJSON = function () {
    const { __v, state, ...productObject } = this.toObject();
    return productObject;
}


module.exports = model('Product', ProductSchema);
const { Schema, model } = require('mongoose');

const ProductSchema = Schema({ 
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    title:{
        type: String  
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
    images: {
        type: String
    }
});


ProductSchema.methods.toJSON = function () {
    const { __v, ...productObject } = this.toObject();
    return productObject;
}


module.exports = model('Product', ProductSchema);
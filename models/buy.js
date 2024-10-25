const { Schema, model } = require('mongoose');
const client = require('./client');
const pay = require('./pay');

const BuySchema = Schema({
    //numero del pedido
    numberBuy: {
        type: Number
    },
    total: {
        type: Number,
        required: true,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    },
    state: {
        type: Boolean,
        default: true 
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client', 
    },
    pay: {
        type: Schema.Types.ObjectId,
        ref: 'Pay', 
    },
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product', 
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            },

        }
    ],
});


BuySchema.methods.toJSON = function () {
    const { __v, state, ...buyObjeto } = this.toObject();
    return buyObjeto;
}

module.exports = model('Buy', BuySchema);

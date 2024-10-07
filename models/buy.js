const { Schema, model } = require('mongoose');

const BuySchema = Schema({
  
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
        required: true
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
    const { __v, state, ...buyObject } = this.toObject();
    return buyObject;
}

module.exports = model('Buy', BuySchema);

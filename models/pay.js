const { Schema, model } = require('mongoose');

const PaySchema = Schema({
    //numero del pedido
    numberpay: {
        type: String,
        required: true
    },
    amountpay: {
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
  
});


PaySchema.methods.toJSON = function () {
    const { __v, state, ...PayObjeto } = this.toObject();
    return payObjeto;
}

module.exports = model('Pay', PaySchema);